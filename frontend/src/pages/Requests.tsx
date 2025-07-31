import MainAreaLayout from "../components/main-layout/main-layout";
import CustomTable from "../components/CustomTable";
import { useState, useEffect } from "react";
import { UploadOutlined, DownOutlined } from "@ant-design/icons";
import { courtClient } from "../store";
import { requestClient, signClient, otpClient } from "../store";
import { useNavigate } from "react-router";
import { useAppStore } from "../store";
import socket from "../client/socket";
import { fetchRequestData } from "../utils/requests/fetchrequestData"
import OfficerSelectionModal from "../modals/OfficerSelectionModal";
import SignatureModal1 from "../modals/signatureModal";
import { handleSignClick } from "../utils/modalFunctions";
import RejectionFormModal from "../modals/rejectionModal";
import DelegateModal from "../modals/delegationModal";
import RequestsDrawer from "../drawer/requestsDrawer";
import { getColumns } from "../hooks/columns";
import { getOfficersList } from "../utils/requests/getOfficers";
import { handleOfficerSelection as handleOfficerSelectionUtil } from "../utils/requests/fetchOfficers";
import {Button,Form,Input,Spin,message,Modal,} from "antd";
import { addNewRequest } from "../utils/requests/addNewRequest";
import { fetchUploadedSignaturesUtil } from "../utils/requests/fetchUploadedSign";

interface RequestItem {
  id: string;
  templateName?: string;
  documentCount?: number;
  data?: Array<any>;
  signStatus?: number;
  rejectedCount?: number;
  createdAt?: string;
  status?: string;
}

const Requests: React.FC = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [officer, setOfficers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
  const [, setCurrentPage] = useState<number>(1);
  const [request, setRequest] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const getSession = useAppStore().init;
  const session = useAppStore().session?.userId;
  const userRole = useAppStore().session?.role ?? 0;
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);
  const [delegateReason, setDelegateReason] = useState("");
  const [delegationRecord, setDelegationRecord] = useState<RequestItem | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureImages, setSignatureImages] = useState<{ id: string; url: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionRecord, setRejectionRecord] = useState<RequestItem | null>(
    null
  );
  const [signingInProgress, setSigningInProgress] = useState(false);

  const handleDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleAddNewRequest = () =>
  addNewRequest({
    form,
    setLoading,
    fetchRequest,
    closeDrawer: () => setIsDrawerOpen(false),
  });
  const handleSend = async (record: any) => {
    const hasData = record.data.length;
    try {
      if (hasData <= 0) {
        message.info("Plesae upload the Bulk Data First");
        return;
      }

      setSelectedRequest(record);
      setIsModalOpen(true);
    } catch (err) {
      console.log("Error while sending the request to officer =>", err);
    }
  };

  const handleOfficerSelection = async () => {
  await handleOfficerSelectionUtil({
    selectedOfficer,
    selectedRequest,
    onSuccess: () => {
      setIsModalOpen(false);
      setSelectedRequest(null);
      setSelectedOfficer(null);
    },
  });
};

  const handleDelegate = (record: any) => {
    setDelegationRecord(record);
    setIsDelegateModalOpen(true);
  };
  const handleReject = (record: any) => {
    setRejectionRecord(record);
    setIsRejectionModalOpen(true);
  };
  const filteredRequest = request.filter((item) =>
    item.templateName?.toLowerCase().includes(search.toLowerCase())
  );

  const fetchRequest = () => {
  fetchRequestData(setRequest, setLoading);
};

  const fetchUploadedSignatures = (record: any) => {
  fetchUploadedSignaturesUtil(session, setSignatureImages, setSelectedRequest, record);
};

const columns = getColumns(userRole, navigate, fetchRequest, {
  handleSend,
  handleDelegate,
  handleReject,
  fetchUploadedSignatures,
  setIsSignatureModalOpen,
  setSelectedRequest,
});
  useEffect(() => {
    const fetchOfficers = async () => {
      if (!session) return; 
    const filteredOfficers = await getOfficersList(session!);
    setOfficers(filteredOfficers);
  };

  fetchOfficers();
  fetchRequest();
  }, []);
  useEffect(() => {
    socket.on("inProcessing", (receivedRecordId: string) => {
      console.log("Received inProcessing for:", receivedRecordId);
      alert("started signing the document");
      setRequest((prev) =>
        prev.map((req) => req.id === receivedRecordId ? { ...req, signStatus: 4 } : req));

      if (selectedRequest?.id === receivedRecordId) {
        setIsOtpModalOpen(false);
        message.success("Started signing the document.");
      }
    });
    return () => {
      socket.off("inProcessing");
    };
  }, [selectedRequest, socket]);

  return (
    <MainAreaLayout
      title={userRole == 3 ? "Request Management" : "Officer functionality"}
      extra={
        <>
          <Input
            placeholder="Search here........"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            type="primary"
            onClick={handleDrawer}
            className="px-6 py-2 text-lg rounded-md"
          >
            New Request for Signature
          </Button>
        </>
      }
    >
      <Spin spinning={loading}>
        <CustomTable
          serialNumberConfig={{
            name: "",
            show: true,
          }}
          columns={columns}
          data={filteredRequest}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Spin>
      <RequestsDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        form={form}
        loading={loading}
        handleAddNewRequest={handleAddNewRequest}
      />
      <OfficerSelectionModal
        visible={isModalOpen}
        officers={officer}
        selectedOfficer={selectedOfficer}
        onSelectOfficer={(value) => setSelectedOfficer(value)}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOfficerSelection}
        loading={loading}
      />
      <DelegateModal
        visible={isDelegateModalOpen}
        onClose={() => setIsDelegateModalOpen(false)}
        delegationRecord={delegationRecord}
        fetchRequest={fetchRequest}
      />
      <SignatureModal1
        visible={isSignatureModalOpen}
        images={signatureImages}
        selectedImage={selectedImage}
        onSelectImage={(img) => setSelectedImage(img)}
        onCancel={() => setIsSignatureModalOpen(false)}
        onUploadClick={() => navigate("/dashboard/signatures")}
        onSignClick={() =>
          handleSignClick(
            selectedImage,
            selectedRequest?.id,
            () => setIsSignatureModalOpen(false),
            () => setIsOtpModalOpen(true)
          )
        }
      />
      <Modal
        title="Enter OTP to Confirm Signature"
        visible={isOtpModalOpen}
        onCancel={() => setIsOtpModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsOtpModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={async () => {
              if (!otp.trim()) {
                message.warning("Please enter OTP");
                return;
              }

              try {
                setSigningInProgress(true);
                const res = await otpClient.verifyOtpAndSign(
                  otp,
                  selectedRequest?.id,
                  selectedImage
                );
                if (res) {
                  message.success("Starts Signing the document");
                  setIsOtpModalOpen(false);
                  setIsSignatureModalOpen(false);
                  setOtp("");
                  setSelectedImage(null);
                  setSelectedRequest(null);
                  fetchRequest();
                } else {
                  message.error("Invalid OTP or signing failed.");
                }
              } catch (error) {
                console.error("Signing failed:", error);
                message.error("Failed to sign document.");
              } finally {
                setSigningInProgress(false);
              }
            }}
          >
            Submit OTP
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </Modal>
      <RejectionFormModal
        visible={isRejectionModalOpen}
        record={rejectionRecord}
        onClose={() => {
          setIsRejectionModalOpen(false);
          setRejectionReason("");
          setRejectionRecord(null);
        }}
        onRejected={fetchRequest}
      />
    </MainAreaLayout>
  );
};

export default Requests;
