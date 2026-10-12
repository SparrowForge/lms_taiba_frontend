"use client"
import { Status } from "@/enums";
import { useAuth } from "@/hooks/useAuth";
import { useTwofa } from "@/hooks/useTwofa";
import { RootState } from "@/store";
import { getErrorMessage } from "@/types/errors";
import { TwofaStatus } from "@/types/twofa";
import { 
    Button, 
    Card, 
    Form, 
    Input, 
    InputRef, 
    Typography, 
    Badge, 
    Space,
    Alert
} from "antd";
import { 
    CheckCircleOutlined, 
    CloseCircleOutlined, 
    SafetyOutlined,
    MailOutlined,
    SafetyCertificateOutlined
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const { Text } = Typography

const MailSettings = () => {
    const { user, getCurrentUser } = useAuth();
    const { codeStatus, actionStatus } = useSelector(
        (state: RootState) => state.twofa
    );
    const [code, setCode] = useState(Array(6).fill(""));
    const inputRefs = useRef<(InputRef | null)[]>([]);
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

    const { sendCodeTwofa, activateMailTwofa, deactivateMailTwofa } = useTwofa();

    const handleSendCode = async () => {
        if (!user?.email) {
            toast.error('Email is required');
            return;
        }
        try {
            await sendCodeTwofa(user.email);
            toast.success('Code Sent to your email');
            setCode(Array(6).fill(""));
            setCountdown(90);
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

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [countdown]);

    const validateCode = (): boolean => {
        const codeString = code.join('');
        if (codeString.length !== 6) {
            toast.error('Please enter all 6 digits');
            return false;
        }
        return true;
    };

    const handleActivate = async () => {
        if (!user?.email) {
            toast.error('Email is required');
            return;
        }
        if (!validateCode()) {
            return;
        }
        const data = {
            email: user.email,
            code: code.join('')
        };
        try {
            await activateMailTwofa(data);
            toast.success("Mail Activated Successfully");
            await getCurrentUser();
            setCode(Array(6).fill(""));
            setCountdown(0);
        } catch (error) {
            console.error('Activation Failed:', error);
            toast.error(getErrorMessage(error) || 'Activation failed!');
        }
    };

    const handleDeactivate = async () => {
        if (!user?.email) {
            toast.error('Email is required');
            return;
        }
        if (!validateCode()) {
            return;
        }
        const data = {
            email: user.email,
            code: code.join('')
        };
        try {
            await deactivateMailTwofa(data);
            toast.success("Mail Deactivated Successfully");
            await getCurrentUser();
            setCode(Array(6).fill(""));
            setCountdown(0);
        } catch (error) {
            console.error('Deactivation Failed:', error);
            toast.error(getErrorMessage(error) || 'Deactivation failed!');
        }
    };


    const isActive = user?.twoFaStatus === TwofaStatus.ACTIVE;

    return (
        <div>
            {/* Mail 2FA */}
            <Card 
                title={
                    <Space>
                        <MailOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                        <span>Mail 2FA</span>
                    </Space>
                }
                style={{ 
                    width: '100%',
                    maxWidth: 450,
                    minHeight: 350,
                    border: isActive ? '2px solid #52c41a' : '1px solid #d9d9d9',
                    boxShadow: isActive ? '0 2px 8px rgba(82, 196, 26, 0.15)' : 'none'
                }}
                headStyle={{
                    background: isActive ? 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)' : 'transparent',
                    borderBottom: isActive ? '1px solid #b7eb8f' : '1px solid #f0f0f0'
                }}
            >
                {/* Status Badge */}
                <div className="mb-4">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Space align="center">
                            <Text strong style={{ fontSize: '14px', color: '#595959' }}>
                                Status:
                            </Text>
                            <Badge
                                status={isActive ? "success" : "default"}
                                text={
                                    <Space>
                                        {isActive ? (
                                            <>
                                                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                                                <Text strong style={{ color: '#52c41a', fontSize: '15px' }}>
                                                    Activated
                                                </Text>
                                            </>
                                        ) : (
                                            <>
                                                <CloseCircleOutlined style={{ color: '#faad14', fontSize: '16px' }} />
                                                <Text strong style={{ color: '#faad14', fontSize: '15px' }}>
                                                    Deactivated
                                                </Text>
                                            </>
                                        )}
                                    </Space>
                                }
                            />
                        </Space>
                        
                        {isActive && (
                            <Alert
                                message="Two-Factor Authentication is Active"
                                description="Your account is protected with email-based two-factor authentication. You'll need to enter a code sent to your email when logging in."
                                type="success"
                                icon={<SafetyCertificateOutlined />}
                                showIcon
                                style={{ 
                                    marginTop: '8px',
                                    background: '#f6ffed',
                                    border: '1px solid #b7eb8f'
                                }}
                            />
                        )}
                    </Space>
                </div>

                {!isActive && (
                    <>
                        <div className="mt-3 mb-4">
                            <Button
                                htmlType="button"
                                disabled={codeStatus.status === Status.LOADING || countdown > 0}
                                type="primary"
                                onClick={handleSendCode}
                                loading={codeStatus.status === Status.LOADING}
                                icon={<MailOutlined />}
                                block
                                size="large"
                                style={{ height: '40px' }}
                            >
                                {codeStatus.status === Status.LOADING ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Send Verification Code"}
                            </Button>
                        </div>
                    </>
                )}

                {isActive && (
                    <div className="mt-3 mb-4">
                        <Button
                            htmlType="button"
                            disabled={codeStatus.status === Status.LOADING || countdown > 0}
                            type="default"
                            onClick={handleSendCode}
                            loading={codeStatus.status === Status.LOADING}
                            icon={<MailOutlined />}
                            block
                            size="large"
                            style={{ height: '40px' }}
                        >
                            {codeStatus.status === Status.LOADING ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Send Code to Deactivate"}
                        </Button>
                    </div>
                )}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={isActive ? handleDeactivate : handleActivate}
                    className="[&_.ant-form-item]:mb-2 [&_.ant-form-item-label]:mb-0"
                    style={{ marginTop: "24px" }}
                >
                    <Form.Item
                        label={
                            <Space>
                                <SafetyOutlined style={{ color: '#1890ff' }} />
                                <span className="text-gray-500 text-[15px] font-semibold">
                                    {isActive ? "Enter OTP to Deactivate" : "Enter OTP to Activate"}
                                </span>
                            </Space>
                        }
                        validateStatus={code.join('').length === 6 ? '' : code.join('').length > 0 ? 'error' : ''}
                        help={code.join('').length > 0 && code.join('').length < 6 ? 'Please enter all 6 digits' : ''}
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
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    className="w-12 h-12 text-center text-lg font-semibold"
                                    style={{
                                        borderColor: code.join('').length === 6 ? '#52c41a' : undefined
                                    }}
                                />
                            ))}
                        </div>
                    </Form.Item>

                    <Form.Item>
                        {isActive ? (
                            <Button
                                htmlType="submit"
                                block
                                size="large"
                                danger
                                disabled={code.join('').length !== 6 || actionStatus.status === Status.LOADING}
                                loading={actionStatus.status === Status.LOADING}
                                icon={<CloseCircleOutlined />}
                                style={{ 
                                    height: '42px',
                                    fontSize: '15px',
                                    fontWeight: 500
                                }}
                            >
                                {actionStatus.status === Status.LOADING ? 'Deactivating...' : 'Deactivate 2FA'}
                            </Button>
                        ) : (
                            <Button
                                htmlType="submit"
                                block
                                size="large"
                                type="primary"
                                disabled={code.join('').length !== 6 || actionStatus.status === Status.LOADING}
                                loading={actionStatus.status === Status.LOADING}
                                icon={<CheckCircleOutlined />}
                                className="bg-gradient-to-r from-[#194EAD] to-[#3793D2] border-none text-white"
                                style={{ 
                                    height: '42px',
                                    fontSize: '15px',
                                    fontWeight: 500
                                }}
                            >
                                {actionStatus.status === Status.LOADING ? 'Activating...' : 'Activate 2FA'}
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default MailSettings
