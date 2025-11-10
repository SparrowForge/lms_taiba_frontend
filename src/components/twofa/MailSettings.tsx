"use client"
import { useAuth } from "@/hooks/useAuth";
import { useTwofa } from "@/hooks/useTwofa";
import { AppDispatch, RootState } from "@/store";
import { getErrorMessage } from "@/types/errors";
import { Button, Card, Form, Input, message, Typography } from "antd";
import { send } from "node:process";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const { Text } = Typography

const MailSettings = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, status, error } = useSelector(
        (state: RootState) => state.twofa
    );
    const [code, setCode] = useState(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [form] = Form.useForm();

    const handleChange = (val: string, index: number) => {
    if (!/^[0-9]?$/.test(val)) return; // allow only digits

    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    // move to next input if digit entered
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

    const { loadTwofaStatus,
        sendCodeTwofa,
        activateMailTwofa,
        deactivateMailTwofa, } = useTwofa()
    useEffect(() => {
        dispatch(loadTwofaStatus);
    }, [dispatch]);

    
    const handleSendCode = async(type: "mail" | "app") => {
        try {
            await sendCodeTwofa(user?.email)
            toast.success('Activation Code Send to your email')
            setCode(Array(6).fill(""))
        } catch (error) {
            console.error('Send Code failed:', error);
            toast.error(getErrorMessage(error) || 'Send Code failed!');
        }
    };

    const onFinish = async(type: "mail" | "app") => {
        const data = {
            email:user?.email,
            code:code.join('')
        }
        console.log(data)
        try {
            await activateMailTwofa(data)
            toast.success('Two FA Activated Successfully')
        } catch (error) {
            console.error('Activation Failed:', error);
            toast.error(getErrorMessage(error) || 'Activationap failed!');
        }
    };

    const handleDeactivate = async(type: "mail" | "app") => {
        const data = {
            email:user?.email,
            code:code.join('')
        }
        console.log(data)
        try {
            await deactivateMailTwofa(data)
            toast.success('Two FA deactivated Successfully')
        } catch (error) {
            console.error('Deactivation Failed:', error);
            toast.error(getErrorMessage(error) || 'Deactivation failed!');
        }
    };
    return (
        <div>
            {/* Mail 2FA */}
            <Card title="Mail 2FA" style={{ width: 450, height: 300 }}>
                <Text>
                    Status:{" "}
                    <b>{status.mail ? "Activated" : "Deactivated"}</b>
                </Text>
                <div className="mt-3">
                    {status.mail ? (
                        <Button danger onClick={() => handleDeactivate("mail")}>
                            Deactivate
                        </Button>
                    ) : (
                        <Button type="primary" onClick={() => handleSendCode("mail")}>
                            {loading ? 'Sending...' : 'Send'}
                        </Button>
                    )}
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="[&_.ant-form-item]:mb-2 [&_.ant-form-item-label]:mb-0"
                >
                    <Form.Item
                        label={<span className="text-gray-500 text-[15px] font-semibold">Enter OTP</span>}
                        required
                        style={{ marginBottom: 12 }}
                    >
                        <div className="flex justify-center gap-2 my-4">
                        {code.map((digit, index) => (
                            <Input
                            key={index}
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className="w-12 h-12 text-center text-lg"
                            />
                        ))}
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            htmlType="submit"
                            block
                            size="middle"
                            type="primary"
                            className="h-9 text-base font-medium mb-0 bg-gradient-to-r from-[#194EAD] to-[#3793D2] border-none text-white"
                        >
                                Activate
                        </Button>
                    </Form.Item>
                 </Form>
            </Card>
        </div>
    )
}

export default MailSettings
