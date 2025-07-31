import { Button, Space, Tag, Popconfirm } from "antd";

export const generateColumns = ({
  templateSignStatus,
  userRole,
  handlePreview,
  handleDelete,
  showRejectModal,
}: {
  templateSignStatus: number;
  userRole: number | undefined;
  handlePreview: (record: any) => void;
  handleDelete: (record: any) => void;
  showRejectModal: (record: any) => void;
}) => {
  return [
    {
      title: "Status",
      dataIndex: "signStatus",
      key: "signStatus",
      render: (_: any, record: any) => {
        const statusMap: any = {
          0: { label: "Unsigned", color: "orange" },
          1: { label: "Ready for Sign", color: "pink" },
          2: { label: "Rejected", color: "red" },
          3: { label: "Delegated", color: "blue" },
          4: { label: "In Progress", color: "purple" },
          5: { label: "Signed", color: "green" },
          6: { label: "Ready for Dispatch", color: "cyan" },
          7: { label: "Dispatched", color: "gray" },
          default: { label: "Unknown", color: "black" },
        };
        const { label, color } =
          statusMap[record.signStatus] || statusMap.default;

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        const isRecordRejected = record.signStatus === 2;
        const isTemplateRejected = templateSignStatus === 2;
        const shouldDisableActions = isRecordRejected || isTemplateRejected;

        return shouldDisableActions ? (
          <Button
            style={{ background: "#ff4d4f", color: "white" }}
            type="primary"
            disabled
          >
            Rejected
          </Button>
        ) : (
          <Space size="middle">
            <Button type="link" onClick={() => handlePreview(record)}>
              View
            </Button>
            {record.signStatus === 0 && (
              <Popconfirm
                title="Are you sure you want to delete this record?"
                onConfirm={() => handleDelete(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" style={{ color: "#ff4d4f" }}>
                  Delete
                </Button>
              </Popconfirm>
            )}
            {userRole === 2 && record.signStatus === 0 && (
              <Button type="link" onClick={() => showRejectModal(record)}>
                Reject
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
};
