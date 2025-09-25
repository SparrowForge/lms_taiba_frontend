
import HeaderSection from './HeaderSection';
import { FaCreditCard, FaDownload, FaFileInvoice, FaHistory } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const PaymentsDashboard = () => {
    return (
        <div className='mx-10 my-10' >
            {/* Top Banner */}
            <HeaderSection />
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total Due | الإجمالي المستحق</p>
                    <h3 className="text-xl font-bold text-gray-800">SAR 4,500</h3>
                    <p className="text-sm text-red-500">Due by August 30, 2023</p>
                    <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                        Pay All Now | دفع الكل الآن
                    </button>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Balance History | تاريخ الرصيد</p>
                    <h3 className="text-xl font-bold text-gray-800">SAR 24,500</h3>
                    <p className="text-sm text-gray-500">Total paid this academic year</p>
                    <button className="mt-2 text-blue-600 text-sm flex items-center gap-1">
                        <FaHistory /> Payment History | تاريخ المدفوعات
                    </button>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Upcoming Fees | الرسوم القادمة</p>
                    <h3 className="text-xl font-bold text-gray-800">SAR 4,500</h3>
                    <p className="text-sm text-gray-500">October Tuition (due Sep 30)</p>
                    <button className="mt-2 text-blue-600 text-sm flex items-center gap-1">
                        <FaFileInvoice /> Fee Schedule | جدول الرسوم
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Invoices */}
                <div className="bg-white shadow rounded-lg p-4 md:col-span-2">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-700">Recent Invoices | الفواتير الحديثة</h3>
                        <div className="flex gap-2">
                            <button className="bg-gray-100 px-3 py-1 rounded-md text-sm">Filter | تصفية</button>
                            <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
                                <FaDownload /> Download All | تنزيل الكل
                            </button>
                        </div>
                    </div>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm">
                                <th className="p-2">#</th>
                                <th className="p-2">Invoice | الفاتورة</th>
                                <th className="p-2">Date | التاريخ</th>
                                <th className="p-2">Amount | المبلغ</th>
                                <th className="p-2">Status | الحالة</th>
                                <th className="p-2">Actions | الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-t">
                                <td className="p-2">INV-2023-09</td>
                                <td className="p-2">September Tuition</td>
                                <td className="p-2">Aug 15, 2023</td>
                                <td className="p-2">SAR 4,500</td>
                                <td className="p-2 text-red-500 flex items-center gap-1">
                                    <AiOutlineCloseCircle /> Unpaid | غير مدفوع
                                </td>
                                <td className="p-2 flex gap-2 text-blue-600">
                                    <FaDownload /> <MdOutlinePayment />
                                </td>
                            </tr>
                            <tr className="border-t">
                                <td className="p-2">INV-2023-08</td>
                                <td className="p-2">August Tuition</td>
                                <td className="p-2">Jul 15, 2023</td>
                                <td className="p-2">SAR 4,500</td>
                                <td className="p-2 text-green-600 flex items-center gap-1">
                                    <AiFillCheckCircle /> Paid | مدفوع
                                </td>
                                <td className="p-2 flex gap-2 text-blue-600">
                                    <FaDownload /> <MdOutlinePayment />
                                </td>
                            </tr>
                            <tr className="border-t">
                                <td className="p-2">INV-2023-07</td>
                                <td className="p-2">Lab Equipment Fee</td>
                                <td className="p-2">Jun 30, 2023</td>
                                <td className="p-2">SAR 1,200</td>
                                <td className="p-2 text-green-600 flex items-center gap-1">
                                    <AiFillCheckCircle /> Paid | مدفوع
                                </td>
                                <td className="p-2 flex gap-2 text-blue-600">
                                    <FaDownload /> <MdOutlinePayment />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Payment Methods */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="font-bold text-gray-700 mb-3">Payment Methods | طرق الدفع</h3>
                    <div className="mb-3 p-3 border rounded-md flex justify-between">
                        <div>
                            <p className="font-semibold">VISA ending in 4821</p>
                            <p className="text-sm text-gray-500">Expires 05/25</p>
                        </div>
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                            Default | الافتراضي
                        </span>
                    </div>
                    <div className="mb-3 p-3 border rounded-md">
                        <p className="font-semibold">Mastercard ending in 3274</p>
                        <p className="text-sm text-gray-500">Expires 11/24</p>
                    </div>
                    <button className="w-full border border-dashed rounded-md p-2 text-sm text-blue-600">
                        + Add Payment Method | إعادة طريقة دفع
                    </button>
                </div>

                {/* Receipts */}
                <div className="bg-white shadow rounded-lg p-4 md:col-span-1">
                    <h3 className="font-bold text-gray-700 mb-3">Recent Receipts | الإيصالات الحديثة</h3>
                    <ul className="text-sm space-y-2">
                        <li className="p-2 border rounded-md flex justify-between items-center">
                            <span>August Tuition Receipt</span>
                            <FaDownload className="text-blue-600" />
                        </li>
                        <li className="p-2 border rounded-md flex justify-between items-center">
                            <span>Lab Equipment Fee Receipt</span>
                            <FaDownload className="text-blue-600" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PaymentsDashboard;