import { Router } from 'express';
import Template from '../../models/template.js';
import path from 'path';
import { find, findOne, updateOne, save } from '../../services/otp.js'
import { find as findTemplate, updateOne as updatedTemplate } from "../../services/templates.js";
import { checkLoginStatus } from '../../middleware/checkAuth.js'
import { checkOfficer } from '../../middleware/checkOfficer.js';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ImageModule from 'docxtemplater-image-module-free';
import convertToPDF from '../../utils/convertToPdf.js';
import { signStatus } from '../../constants/index.js';
import { io } from '../../config/socket.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/:id', checkLoginStatus, checkOfficer, async (req, res) => {
  try {
    const templateId = req.params.id;
    // **** code for generating OTP and storing it in database ****

    // const otp = Math.floor(100000 + Math.random() * 900000);
    // await save({
    //   templateId,
    //   userId,
    //   otp,
    //   createdAt: new Date(),
    //   expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
    // }); 
    res.status(200).json({ success: true, message: "generated Successfully" })
  } catch (err) {
    console.log("error while generating OTP");
    res.status(400).json({ success: false })
  }
})
router.post("/verify", checkLoginStatus, checkOfficer, async (req, res) => {
  console.log(req.body);
  const { otp, recordId, selectedImg } = req.body;
  console.log("otp =>", otp, " receiverId=>", recordId, " selectedImg", selectedImg.url);
  try {
    // const otpRecord = await OtpModel.findOne({ recordId});
    // if (!otpRecord || otpRecord.expiresAt < Date.now()) {
    //   return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    // }
    const templateDocArray = await findTemplate({ id: recordId });
    if (!templateDocArray || templateDocArray.length === 0) {
      return res.status(404).json({ message: "Template not found" });
    }
    const templateDoc = templateDocArray[0];

    io.to(req.session.userId).emit("inProcessing", templateDoc.id);
    io.to(templateDoc.createdBy.toString()).emit("inProcessing", templateDoc.id);
    const templatePath = path.resolve(templateDoc.url.replace("/uploads", "./uploads/"));
    const relativePath = selectedImg.url.replace("http://localhost:3000/uploads/", "");
    const signaturePath = path.join(__dirname, "../../../uploads", relativePath);
    if (!fs.existsSync(signaturePath)) {
      return res.status(404).json({ message: "Signature image not found", path: signaturePath });
    }

    let signedCount = 0;
    templateDoc.signStatus = signStatus.inProcess;
    for (const record of templateDoc.data) {
      if (record?.isDeleted || record?.signStatus == signStatus.rejected) continue;

      const recordData = Object.fromEntries(record.data.entries());
      recordData["image:signature"] = signaturePath;
      console.log("recordData =>", recordData)
      const content = fs.readFileSync(templatePath, 'binary');
      const zip = new PizZip(content);

      const imageModule = new ImageModule({
        centered: false,
        getImage: tagValue => fs.readFileSync(tagValue),
        getSize: () => [150, 50],
      });

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [imageModule],
      });

      doc.render(recordData);

      const docBuffer = doc.getZip().generate({ type: 'nodebuffer' });
      const signedDir = path.resolve("uploads/signed");
      if (!fs.existsSync(signedDir)) {
        fs.mkdirSync(signedDir, { recursive: true });
      }
      const signedDocxPath = `uploads/signed/${Date.now()}_${record.id}_signed.docx`;
      fs.writeFileSync(signedDocxPath, docBuffer);
      const pdfBuf = await convertToPDF(docBuffer);

      const finalPdfPath = signedDocxPath.replace('.docx', '.pdf');
      fs.writeFileSync(finalPdfPath, pdfBuf);

      record.signStatus = 5;
      record.signedDate = new Date();
      record.url = finalPdfPath;
      signedCount++;
      templateDoc.signCount = signedCount;
      await templateDoc.save();
      io.to(req.session.userId).emit("signProgress", {
        recordId: templateDoc.id, signedCount,
        totalCount: templateDoc.data.length,
      });
      io.to(templateDoc.createdBy.toString()).emit("signProgress", {
        recordId: templateDoc.id, signedCount,
        totalCount: templateDoc.data.length,
      });
    }
    templateDoc.signStatus = 5;
    templateDoc.signedDate = new Date();
    templateDoc.signedBy = req.session.userId;
    templateDoc.signatureId = selectedImg.id;
    await templateDoc.save();
    res.status(200).json({
      success: true,
      message: `Signing completed for ${signedCount} records`,
      signedCount,
    });

  } catch (err) {
    console.error("Signing error:", err);
    res.status(500).json({ message: "Signing failed", error: err.message });
  }
})


export default router; 