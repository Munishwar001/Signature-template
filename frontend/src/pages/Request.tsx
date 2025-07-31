import {Button,Form,message,Spin,} from "antd";
import MainAreaLayout from "../components/main-layout/main-layout";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { requestClient } from "../store";
import CustomTable from "../components/CustomTable";
import { useAppStore } from "../store";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Modal, Input } from "antd";
import { generateColumns } from "../hooks/requestColumn";
import RequestDrawer from "../drawer/requestDrawer";
import { handleDeleteRequest } from "../utils/request/handleDelete";
import { handlePreviewRequest } from "../utils/request/handlePreview";

export default function RequestPage() {
  const [form] = Form.useForm();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dynamicColumns, setDynamicColumns] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getSession = useAppStore().init;
  const userRole = useAppStore().session?.role;
  const templateVariablesRef = useRef([]);
  const templateTitleRef = useRef("");
  const templateSignStatusRef = useRef(0);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectingRecord, setRejectingRecord] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { id } = useParams();

  const handleDrawer = () => setIsDrawerOpen(true);

  const handleAddNewRequest = async () => {
    try {
      const values = await form.validateFields();
      const response = await requestClient.uploadBulkData(values, id);

      if (response.allfields && response.templateData?.data) {
        await fetchData();
        message.success("Data uploaded successfully");
        form.resetFields();
        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      message.error("Failed to submit request");
    }
  };
  const handleDelete = (record: any) => {
  handleDeleteRequest(record, id, fetchData);
};


  const handlePreview = (record: any) => {
  handlePreviewRequest(record, templateSignStatusRef.current, id);
};

  const showRejectModal = (record: any) => {
    setRejectingRecord(record);
    setIsRejectModalVisible(true);
  };
  const handleConfirmReject = async () => {
    try {
      const response = await requestClient.rejectTemplate(
        { requestId: rejectingRecord.id, rejectionReason: rejectReason },
        id
      );

      if (response) {
        message.success("Rejected");
        await fetchData();
      }
    } catch (err) {
      console.log("Error while rejecting request =>", err);
      message.error("Rejection failed");
    } finally {
      setIsRejectModalVisible(false);
      setRejectReason("");
      setRejectingRecord(null);
    }
  };

  const handleDownloadFormatTemplate = () => {
    const headers = templateVariablesRef.current.map((v: any) => v.name);

    if (headers.length === 0) {
      message.warning("No template variables found.");
      return;
    }

    const worksheetData = [headers];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "format_template.xlsx");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await requestClient.fetchRequestData(id);

      if (!response.allfields || response.allfields.length === 0) {
        message.warning("Template has no defined fields");
        setDynamicColumns([]);
        setTableData([]);
        return;
      }
      templateVariablesRef.current = response.templateVariables || [];
      templateTitleRef.current = response.templateName;
      templateSignStatusRef.current = response.signStatus;
      console.log("current signStatus =>", response.signSatus);
      const fieldColumns = response.allfields.map((field: string) => ({
        title: field,
        dataIndex: field,
        key: field,
      }));


      const actionColumns = generateColumns({
        templateSignStatus: templateSignStatusRef.current,
        userRole,
        handlePreview,
        handleDelete,
        showRejectModal,
      });

      const completeColumns = [...fieldColumns, ...actionColumns];
      setDynamicColumns(completeColumns);

      const transformedData = response.data.map((item: any, index: number) => {
        const rowData: any = {
          key: index,
          id: item.id,
          signStatus: item.signStatus,
          url: item.url,
        };

        const dataEntries =
          item.data instanceof Map
            ? Array.from(item.data.entries())
            : Object.entries(item.data);

        dataEntries.forEach(([key, value]: any) => {
          rowData[key] = value;
        });

        return rowData;
      });

      setTableData(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load template data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <MainAreaLayout
      title={templateTitleRef.current}
      extra={
        <>
          {templateSignStatusRef.current == 0 && (
            <Button
              type="primary"
              onClick={handleDrawer}
              className="px-6 py-2 text-lg rounded-md"
            >
              Bulk Upload
            </Button>)}
          <Button
            type="primary"
            className="px-6 py-2 text-lg rounded-md"
            onClick={handleDownloadFormatTemplate}
          >
            Download Format Template
          </Button>
        </>
      }
    >
      {loading ? (
        <div className="text-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <CustomTable
          serialNumberConfig={{
            name: "",
            show: true,
          }}
          columns={
            dynamicColumns.length > 0
              ? dynamicColumns
              : [
                {
                  title: "No Data Available",
                  dataIndex: "noData",
                  key: "noData",
                  render: () => "Upload data or check template fields",
                },
              ]
          }
          data={tableData}
        />
      )}

      <RequestDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        form={form}
        handleAddNewRequest={handleAddNewRequest}
        loading={loading}
      />
      <Modal
        title="Reject Reason"
        visible={isRejectModalVisible}
        onOk={handleConfirmReject}
        onCancel={() => setIsRejectModalVisible(false)}
        okText="Confirm Reject"
        okButtonProps={{ danger: true }}
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter reason for rejection"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </MainAreaLayout>
  );
}
