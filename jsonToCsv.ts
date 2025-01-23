import fs from "fs";
import path from "path";
import { Parser, ParserOptions } from "@json2csv/plainjs";

const LOCATION_PATH = "./";

interface DataEntry {
  date: string;
  branch: string;
  item: string;
  debit: number | null;
  credit: number | null;
}

const DATA: DataEntry[] = [
  {
    date: "08/11/2024",
    branch: "Branch 1",
    item: "Aur",
    debit: 2000,
    credit: null,
  },
  {
    date: "08/11/2024",
    branch: "Branch 1",
    item: "Netgiro",
    debit: 1000,
    credit: null,
  },
  {
    date: "08/11/2024",
    branch: "Branch 1",
    item: "Paypal",
    debit: 2400,
    credit: null,
  },
  {
    date: "08/11/2024",
    branch: "Branch 1",
    item: "Sales: Tax 11%",
    debit: null,
    credit: 4000,
  },
  {
    date: "08/11/2024",
    branch: "Branch 1",
    item: "Sales: Tax 24%",
    debit: null,
    credit: 1400,
  },
];

const main = (): void => {
  const tableHeadIds: (keyof DataEntry)[] = [
    "date",
    "branch",
    "item",
    "debit",
    "credit",
  ];
  const tableHeadNames: string[] = [
    "Date",
    "Branch",
    "Item",
    "Debit",
    "Credit",
  ];
  const json: DataEntry[] = DATA;
  const fileName = "export.csv";
  exportJsonToCsv(json, tableHeadIds, tableHeadNames, fileName);
};

const exportJsonToCsv = (
  json: DataEntry[],
  fieldsId: (keyof DataEntry)[],
  fieldsName: string[],
  fileName: string
): void => {
  try {
    const fields: ParserOptions<DataEntry>["fields"] = fieldsId.map(
      (field, index) => ({
        label: fieldsName[index],
        value: field,
      })
    );

    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(json);

    const filePath = path.join(LOCATION_PATH, fileName);

    fs.writeFile(filePath, csv, (err) => {
      if (err) {
        console.error("Error writing CSV file:", err);
      } else {
        console.log(`CSV file has been saved successfully at: ${filePath}`);
      }
    });
  } catch (error) {
    console.error("Error exporting to CSV:", error);
  }
};

main();
