
import HeaderSection from './HeaderSection';
import { FaCreditCard, FaDownload, FaFileInvoice, FaHistory } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { Col, Row } from 'antd';
import RecentInvoices from './RecentInvoices';
import StatisticsCard from './StatisticsCard';

const PaymentsDashboard = () => {
    return (
        <div className='mx-10 my-10' >
            {/* Top Banner */}
            <HeaderSection />
            {/* Stats Cards */}
          <StatisticsCard/>

            {/* Content Section */}
            <Row
                gutter={[24, 24]}
                className=""
                style={{ width: '100%', minWidth: 0, height: '100%' }}
            >
                {/* Invoices */}
                <Col xs={24} lg={16} style={{ marginBottom: '40px' }}>
                    <RecentInvoices />

                </Col>
                <Col xs={24} lg={8}>
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
                </Col>
            </Row>
        </div >
    );
};

export default PaymentsDashboard;