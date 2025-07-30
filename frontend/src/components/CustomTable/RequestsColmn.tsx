// // src/tables/RequestColumns.ts

// import { Menu, Button, Tag, Dropdown } from "antd";
// import { DownOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router";

// const RequestColumns = (userRole: number) => {
//   const navigate = useNavigate();

//   const columns = [
//     {
//       title: "Request",
//       dataIndex: "templateName",
//       key: "name",
//       render: (count: any[], record: any) => (
//         <Button
//           type="link"
//           onClick={async () => {
//             await requestClient.previewDocs(record.id);
//           }}
//         >
//           {record.templateName}
//         </Button>
//       ),
//     },
//     {
//       title: "No. of Document",
//       dataIndex: "data",
//       key: "NoOfDocument",
//       render: (count: any[], record: any) => (
//         <Button
//           type="link"
//           onClick={() => {
//             navigate(`/dashboard/request/${record.id}`);
//           }}
//         >
//           {count.length || 0}
//         </Button>
//       ),
//     },
//     {
//       title: "Rejected Document",
//       dataIndex: "rejectValue",
//       key: "RejectedDocument",
//       render: (count: number, record: any) => {
//         const rejectValue =
//           record.data?.filter((d: any) => d.signStatus == 2)?.length || 0;
//         return (
//           <Button
//             type="link"
//             onClick={() => {
//               navigate(`/dashboard/request/rejected/${record.id}`);
//             }}
//           >
//             {rejectValue}
//           </Button>
//         );
//       },
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       key: "CreatedAt",
//       sorter: (a: any, b: any) =>
//         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
//       render: (createdAt: string) => {
//         const date = new Date(createdAt);
//         return `${date.getDate().toString().padStart(2, "0")}-${(
//           date.getMonth() + 1
//         )
//           .toString()
//           .padStart(2, "0")}-${date.getFullYear()}`;
//       },
//     },
//     {
//       title: "Status",
//       dataIndex: "signStatus",
//       key: "signStatus",
//       render: (_: any, record: any) => {
//         const statusMap: any = {
//           0: { label: "Unsigned", color: "orange" },
//           1: { label: "Ready for Sign", color: "pink" },
//           2: { label: "Rejected", color: "red" },
//           3: { label: "Delegated", color: "blue" },
//           4: { label: "In Progress", color: "purple" },
//           5: { label: "Signed", color: "green" },
//           6: { label: "Ready for Dispatch", color: "cyan" },
//           7: { label: "Dispatched", color: "gray" },
//           default: { label: "Unknown", color: "black" },
//         };
//         let signstatusValue = record.signStatus;
//         const { label, color } =
//           statusMap[signstatusValue] || statusMap.default;

//         return <Tag color={color}>{label}</Tag>;
//       },
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: any) => {
//         const handleMenuClick = ({ key }: any) => {
//           if (key === "clone") {
//             requestClient
//               .cloneFormData(record._id)
//               .then(() => {
//                 message.success("Request cloned successfully");
//                 fetchRequest();
//               })
//               .catch(() => {
//                 message.error("Failed to clone request");
//               });
//           } else if (key === "send") {
//             handleSend(record);
//           } else if (key === "delete") {
//             handleDelete(record._id);
//           } else if (key === "sign") {
//             fetchUploadedSignatures(record);
//             setIsSignatureModalOpen(true);
//           } else if (key === "delegate") {
//             handleDelegate(record);
//           } else if (key === "reject") {
//             handleReject(record);
//           }
//         };

//         const menu = (
//           <Menu onClick={handleMenuClick}>
//             <Menu.Item key="clone">Clone</Menu.Item>
//             {record.signStatus == 0 && (
//               <Menu.Item key="send">Send for Signature</Menu.Item>
//             )}
//             {userRole == 2 && record.signStatus == 1 && (
//               <Menu.Item key="delegate">Delegate for Signature</Menu.Item>
//             )}
//             {userRole == 3 && record.signStatus == 0 && (
//               <Menu.Item key="delete">Delete</Menu.Item>
//             )}
//             {((userRole == 2 && record.signStatus == 1) ||
//               (userRole == 3 && record.signStatus == 3)) && (
//               <Menu.Item key="sign">Sign</Menu.Item>
//             )}
//             {userRole == 2 && record.signStatus == 1 && (
//               <Menu.Item key="reject">Reject</Menu.Item>
//             )}
//           </Menu>
//         );

//         return (
//           <Dropdown overlay={menu} trigger={["click"]}>
//             {record.signStatus !== 2 ? (
//               <Button>
//                 Actions <DownOutlined />
//               </Button>
//             ) : (
//               <Button
//                 style={{ background: "#ff4d4f", color: "white" }}
//                 type="primary"
//                 disabled={true}
//               >
//                 Rejected
//               </Button>
//             )}
//           </Dropdown>
//         );
//       },
//     },
//   ];

//   return columns;
// };

// export default RequestColumns;
