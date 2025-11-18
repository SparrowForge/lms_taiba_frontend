"use client"
import { Status } from "@/enums";
import { useAuth } from "@/hooks/useAuth";
import { useTwofa } from "@/hooks/useTwofa";
import { AppDispatch, RootState } from "@/store";
import { getErrorMessage } from "@/types/errors";
import { TwofaStatus } from "@/types/twofa";
import { Button, Card, Form, Input, message, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const { Text } = Typography

const MailSettings = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const { codeStatus, actionStatus } = useSelector(
        (state: RootState) => state.twofa
    );
    const [code, setCode] = useState(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [form] = Form.useForm();
    const [countdown, setCountdown] = useState(0);

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

    const { sendCodeTwofa,
        activateMailTwofa,
        deactivateMailTwofa, } = useTwofa()

    const { getCurrentUser } = useAuth()



    
    const handleSendCode = async(type: "mail" | "app") => {
        try {
            await sendCodeTwofa(user?.email)
            toast.success('Code Sent to your email')
            setCode(Array(6).fill(""))
            setCountdown(90)
        } catch (error) {
            console.error('Send Code failed:', error);
            toast.error(getErrorMessage(error) || 'Send Code failed!');
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
        timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
    }

    return () => clearInterval(timer);
  }, [countdown]);

    const handleActivate = async() => {
        const data = {
            email:user?.email,
            code:code.join('')
        }
        try {
            await activateMailTwofa(data)
            toast.success("Mail Activated Successfully")
            await dispatch(getCurrentUser)
            setCode(Array(6).fill(""))
            setCountdown(0)
        } catch (error) {
            console.error('Activation Failed:', error);
            toast.error(getErrorMessage(error) || 'Activationap failed!');
        }
    };

    const handleDeactivate = async() => {
        const data = {
            email:user?.email,
            code:code.join('')
        }
        try {
            await deactivateMailTwofa(data)
            toast.success("Mail Deactivated Successfully")
            await dispatch(getCurrentUser)
            setCode(Array(6).fill(""))
            setCountdown(0)
        } catch (error) {
            console.error('Deactivation Failed:', error);
            toast.error(getErrorMessage(error) || 'Deactivation failed!');
        }
    };


    return (
        <div>
            {/* Mail 2FA */}
            <Card title="Mail 2FA" style={{ width: 450, height: 350 }}>
               <Text>
                    Status:{" "}
                <b
                    style={{
                    color: user?.twoFaStatus === TwofaStatus.ACTIVE ? "#52c41a" : "#faad14",
                    }}
                >
                    {user?.twoFaStatus === TwofaStatus.ACTIVE ? "Activated" : "Deactivated"}
                </b>
            </Text>

                <div className="mt-3">
                    <Button
                            htmlType="button"
                            disabled={codeStatus.status == Status.LOADING || countdown > 0}
                            type="primary"
                            onClick={() => handleSendCode("mail")}
                            >
                        {codeStatus.status == Status.LOADING ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Send Code"}
                    </Button>
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={user?.twoFaStatus === TwofaStatus.ACTIVE ? handleDeactivate : handleActivate}
                    className="[&_.ant-form-item]:mb-2 [&_.ant-form-item-label]:mb-0"
                    style={{marginTop:"24px"}}
                >
                    <Form.Item
                        label={<span className="text-gray-500 text-[15px] font-semibold">Enter OTP</span>}
                        rules={[{ required: true, message: "OTP is required" }]}
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
                        {
                            user?.twoFaStatus === TwofaStatus.ACTIVE ? 
                            <Button
                                htmlType="submit"
                                block
                                size="middle"
                                type="primary"
                                className="h-9 text-base font-medium mb-0 bg-gradient-to-r from-[#194EAD] to-[#3793D2] border-none text-white"
                                disabled={countdown == 0}
                        >
                                {actionStatus.status === Status.LOADING ? 'Deactivating': 'Deactivate'}
                        </Button> : <Button
                                htmlType="submit"
                                block
                                size="middle"
                                type="primary"
                                className="h-9 text-base font-medium mb-0 bg-gradient-to-r from-[#194EAD] to-[#3793D2] border-none text-white"
                                disabled={countdown == 0}
                        >
                                {actionStatus.status === Status.LOADING ? 'Activating': 'Activate'}
                        </Button>
                        }
                    </Form.Item>
                 </Form>
            </Card>
        </div>
    )
}

export default MailSettings
