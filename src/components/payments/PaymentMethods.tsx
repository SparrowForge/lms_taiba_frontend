import { Card } from "antd";


const PaymentMethods = () => {
    return (
        <Card className="bg-white shadow rounded-lg p-4">
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
        </Card>
    );
};

export default PaymentMethods;