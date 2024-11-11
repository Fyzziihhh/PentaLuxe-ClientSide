import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { IOrder } from "@/types/orderTypes";
import { AppHttpStatusCodes } from "@/types/statusCode";
import api from "@/services/apiService";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Pagination from "@/components/Pagination";
import { PulseLoader } from "react-spinners";
import { toast } from "sonner";

const AdminSalesReport = () => {
  const [loading, setLoading] = useState(false);
  const [displaySalesReportData,setDisplaySalesReportData]=useState<IOrder[] >([]);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [dateRange, setDateRange] = useState("full-report"); // Default to daily
  const [customDates, setCustomDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [salesReportData, setSalesReportData] = useState<IOrder[]>([]);


  const handlePagination = (currentPageData: IOrder[]) => {
    setDisplaySalesReportData(currentPageData)
  }


  const getAllSalesReport = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/admin/sales-report", { dateRange });
      if (res.status === AppHttpStatusCodes.OK) {
        setSalesReportData(res.data.data);
      }
    } catch (err) {
      toast("Failed to fetch sales report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    const title = "Sales Report";
    const headers = [
      "Order ID",
      "Customer Name",
      "Order Amount",
      "Payment",
      "Coupons",
      "Order Date",
      "Status",
    ];
  
    // Prepare data similar to the PDF version
    const data = salesReportData!.map((order) => [
      order._id,
      order.user.username?.toUpperCase(),
      order.totalAmount.toFixed(0),
      order.paymentMethod.toUpperCase(),
      order.couponDiscount > 0 ? order.couponDiscount : "No Coupon",
      new Date(order.orderDate).toDateString(),
      order.status,
    ]);
  
    // Add headers as the first row in the data array
    const worksheetData = [headers, ...data];
  
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
    // Define column widths
    worksheet["!cols"] = [
      { wch: 15 }, // Width for "Order ID" column
      { wch: 20 }, // Width for "Customer Name" column
      { wch: 15 }, // Width for "Order Amount" column
      { wch: 18 }, // Width for "Payment" column
      { wch: 15 }, // Width for "Coupons" column
      { wch: 20 }, // Width for "Order Date" column
      { wch: 15 }, // Width for "Status" column
    ];
  
    // Append worksheet to workbook with the title "Sales Report"
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
  
    // Download the Excel file with a specified filename
    XLSX.writeFile(workbook, "sales_report.xlsx");
  };


  const downloadPDF = () => {
    const doc = new jsPDF();
    const title = "Sales Report";
    const headers = [
      [
        "Order ID",
        "Customer Name",
        "Order Amount",
        "Payment",
        "Coupons",
        "Order Date",
        "Status",
      ],
    ];

    const data = salesReportData!.map((order) => [
      order._id,
      order.user.username?.toUpperCase(),
      order.totalAmount.toFixed(0),
      order.paymentMethod.toUpperCase(),
      order.couponDiscount > 0 ? order.couponDiscount : "No Coupon",
      new Date(order.orderDate).toDateString(),
      order.status,
    ]);

    doc.text(title, 14, 20);
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      theme: "grid", // Basic grid style
      styles: {
        cellPadding: 3, // Padding for cells
        fontSize: 10,
        halign: "center", // Font size for table
      },
      headStyles: {
        fillColor: [100, 100, 255], // Light blue background for header
        textColor: [255, 255, 255], // White text for header
        fontSize: 12,
        halign: "center", // Center align header text
      },
    });

    doc.save("sales_report.pdf");
  };

  const generateSalesReport = async () => {
    setLoading(true);
    const payload = {
      dateRange,
      startDate: customDates.startDate,
      endDate: customDates.endDate,
    };
    try {
      const response = await api.post("/api/admin/sales-report", payload);
      if (response.status === AppHttpStatusCodes.OK) {
        setSalesReportData(response.data.data);
      }
    } catch (err) {
      toast("Failed to generate sales report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const totalOrderPrice =
      salesReportData &&
      salesReportData.reduce((acc, order) => {
        return acc + order.totalAmount;
      }, 0);

    totalOrderPrice && setTotalOrderAmount(totalOrderPrice);

    const totalCouponDiscount =
      salesReportData &&
      salesReportData.reduce((acc, order) => {
        return acc + order.couponDiscount;
      }, 0);

    totalCouponDiscount && setTotalDiscount(totalCouponDiscount);

    salesReportData && setSalesCount(salesReportData.length);
  }, [salesReportData]);

  useEffect(() => {
    getAllSalesReport();
  }, []);

  return (
    <div className="p-8 bg-white min-h-screen text-gray-700">
      <h1 className="text-4xl font-semibold text-gray-800 mb-6">
        Sales Report
      </h1>

      {/* Sales Report Filters */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center mb-2 md:mb-0">
          <label htmlFor="date-range" className="mr-2 text-lg font-medium">
            Select Date Range:
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            id="date-range"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 transition duration-200"
          >
            <option value="full-report">Full Report</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </div>

        {/* Custom Date Inputs */}
        {dateRange === "custom" && (
          <div className="hidden custom-dates md:flex items-center">
            <label htmlFor="start-date" className="mr-2 font-medium">
              Start Date:
            </label>
            <input
              type="date"
              value={customDates.startDate}
              onChange={(e) =>
                setCustomDates((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              id="start-date"
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />

            <label htmlFor="end-date" className="mx-2 font-medium">
              End Date:
            </label>
            <input
              value={customDates.endDate}
              onChange={(e) =>
                setCustomDates((prev) => ({ ...prev, endDate: e.target.value }))
              }
              type="date"
              id="end-date"
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        )}

        {/* Generate Report Button */}
        <button
          onClick={generateSalesReport}
          className="mt-2 md:mt-0 bg-gray-800 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-700 transition duration-200"
        >
          Generate Sales Report
        </button>
      </div>

      {/* Sales Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Sales Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <strong className="text-lg">Overall Sales Count:</strong>{" "}
            <span id="overall-sales-count" className="text-gray-700 font-bold">
              {salesCount}
            </span>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <strong className="text-lg">Overall Order Amount:</strong>{" "}
            <span id="overall-order-amount" className="text-gray-700 font-bold">
              ₹{totalOrderAmount.toFixed(0)}
            </span>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <strong className="text-lg">Overall Discounts:</strong>{" "}
            <span id="overall-discount" className="text-gray-700 font-bold">
              ₹{totalDiscount}
            </span>
          </div>
        </div>
      </div>

      {/* Sales Report Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr className="text-center">
              <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Order Amount
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Coupons
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr className="text-center">
                <td colSpan={7} className="text-center px-6 py-4 text-gray-600">
                  <p>
                    <PulseLoader />
                  </p>
                </td>
              </tr>
            ) : salesReportData?.length === 0 || !salesReportData ? (
              <tr>
                <td colSpan={7} className="text-center px-6 py-4 text-gray-600">
                  No Report Found On that Particular Date Range
                </td>
              </tr>
            ) : (
              ((displaySalesReportData.length>0?displaySalesReportData:salesReportData).map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center font-bold">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {order.user?.username.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {order.totalAmount.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {order.paymentMethod.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {order.couponDiscount > 0
                      ? order.couponDiscount
                      : "No Coupon"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {new Date(order.orderDate).toDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {order.status}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
     <Pagination itemsPerPage={5} items={salesReportData!} onPageChange={handlePagination}/>

      {/* Report Download Options */}
      <div className="flex justify-end mb-6 items-center">
        <div className="mr-4">
          <h3 className="font-medium text-gray-800 text-lg">
            Download Report:
          </h3>
        </div>
        <button
          onClick={downloadPDF}
          className="bg-gray-700 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 transition duration-200 mr-2"
        >
          Download PDF
        </button>
        <button onClick={downloadExcel} className="bg-gray-700 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 transition duration-200">
          Download Excel
        </button>
      </div>
    </div>
  );
};

export default AdminSalesReport;
