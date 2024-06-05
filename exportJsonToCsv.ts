import fs from "fs";
import { Parser } from "@json2csv/plainjs";
import { format } from "date-fns";

const exportJsonToCsv = () => {
  const fileName = "Pizza Order Summary (4 - 10 March 2024)"; // Corrected filename
  const jsonPath = "./upsell.orders.json";

  // Check if the JSON file exists
  if (!fs.existsSync(jsonPath)) {
    console.log("JSON file does not exist");
    process.exit(1);
  }

  const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  const formattedTableData = json.map((item: any) => ({
    company_name: item.billing?.name,
    customer_name: item.billing?.metadata?.who_ordering || item.customer.name,
    ssn: item.billing?.metadata?.ssn || item.customer?.ssn,
    phone: item.billing?.metadata?.phone || item.customer.phone?.phone_number,
    customer_note: item.customer_note,
    order_number: item.order_number,
    order_method: getOrderMethodLabel(item.order_method),
    time: format(new Date(item.createdAt.$date), "dd MMM yyyy, hh:mm a"),
    payment: item.date_paid ? "Paid" : "Unpaid",
    order_status: getOrderStatusLabel(item.order_status),
    total: item.total,
  }));

  const tableHeadIds = [
    "company_name",
    "customer_name",
    "ssn",
    "phone",
    "customer_note",
    "order_number",
    "order_method",
    "time",
    "payment",
    "order_status",
    "total",
  ];
  const tableHeadLabels = [
    "Company Name",
    "Customer Name",
    "SSN",
    "Phone",
    "Customer Note",
    "Order Number",
    "Order Method",
    "Time",
    "Payment",
    "Payment Status",
    "Total",
  ];

  console.log(formattedTableData);

  const fieldsId = tableHeadIds;
  const fieldsName = tableHeadLabels;

  const fields = fieldsId.map((field, index) => ({
    label: fieldsName[index],
    value: field,
  }));

  const json2csv = new Parser({ fields }); // Create a new instance of the Parser

  const csv = json2csv.parse(formattedTableData); // Use the instance to parse the JSON to CSV

  fs.writeFileSync(`${fileName}.csv`, csv, { encoding: "utf8" });

  console.log(`CSV file "${fileName}.csv" has been created.`);
};

const getOrderMethodLabel = (orderMethod: string): string => {
  switch (orderMethod) {
    case "pickup":
      return "Pickup";
    case "delivery":
      return "Delivery";
    case "dine-in":
      return "Dine-in";
    case "wolt":
      return "Wolt";
    case "shipping":
      return "Shipping";
    case "instant":
      return "Instant";
    case "pending":
      return "Pending";
    default:
      return "Unknown";
  }
};

const getOrderStatusLabel = (orderStatus: string): string => {
  switch (orderStatus) {
    case "order_received":
      return "Order Received";
    case "processing":
      return "Processing";
    case "waiting_payment":
      return "Waiting Payment";
    case "ready_to_pickup":
      return "Ready for Pickup";
    case "ready_to_ship":
      return "Ready for Delivery";
    case "on_delivery":
      return "On Delivery";
    case "delivered":
      return "Delivered";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "refunded":
      return "Refunded";
    case "failed":
      return "Failed";
    default:
      return "Unknown";
  }
};

exportJsonToCsv();
