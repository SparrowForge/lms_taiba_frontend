"use client"

import { Button, Card, Form, Input, InputRef, Typography, Space, Alert } from 'antd';
import { MailOutlined, SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTwofa } from '@/hooks/useTwofa';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/types/errors';
import { useAuth } from '@/hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Status } from '@/enums';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const { Text, Title } = Typography;

const VerifyTwofaPage: React.FC = () => {
    const { user, isTwoFaVerified, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { loading, codeStatus } = useSelector((state: RootState) => state.twofa);
    const [code, setCode] = useState(Array(6).fill(""));
    const inputRefs = useRef<(InputRef | null)[]>([]);
    const [form] = Form.useForm();
    const [countdown, setCountdown] = useState(0);
    const { sendCodeTwofa } = useTwofa();

    // Redirect if user is not authenticated or doesn't need 2FA verification
    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) {
            return;
        }

        // Redirect if user doesn't exist
        if (!user) {
            router.push('/login');
            return;
        }
        
        // If 2FA is not active, redirect to dashboard
        if (user.twoFaStatus && user.twoFaStatus !== 'active') {
            router.push('/');
            return;
        }
        
        // If 2FA is already verified, redirect to dashboard (but only if we're on verify-2fa page)
        if (isTwoFaVerified && pathname?.includes('verify-2fa')) {
            router.push('/');
            return;
        }
    }, [user, isTwoFaVerified, isLoading, pathname, router]);

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

    const handleSendCode = async () => {
        if (!user?.email) {
            toast.error('Email is required');
            return;
        }
        try {
            await sendCodeTwofa(user.email);
            toast.success('Verification code sent to your email');
            setCode(Array(6).fill(""));
            setCountdown(90);
        } catch (error) {
            console.error('Send Code failed:', error);
            toast.error(getErrorMessage(error) || 'Failed to send code!');
        }
    };

    const validateCode = (): boolean => {
        const codeString = code.join('');
        if (codeString.length !== 6) {
            toast.error('Please enter all 6 digits');
            return false;
        }
        return true;
    };

    const { verifyMailTwofa } = useTwofa();

    const onFinish = async () => {
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
            await verifyMailTwofa(data);
            // verifyMailTwofa already handles redirect on success
        } catch (error) {
            console.error('Verification Failed:', error);
            toast.error(getErrorMessage(error) || 'Verification failed!');
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#1F4BCA]">
            {/* Left Component - Same as login page */}
            <div className="hidden md:flex md:w-1/2 h-screen items-center justify-center">
                <div className="text-white text-center px-8">
                    <h1 className="text-4xl font-bold mb-4">Secure Your Account</h1>
                    <p className="text-lg opacity-90">
                        Enter the verification code sent to your email to complete the login process.
                    </p>
                </div>
            </div>

            {/* Right Component - Verification Form */}
            <div className="w-full md:w-1/2 min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center items-center mb-8">
                        <Image src="/logo2.PNG" alt="logo" width={80} height={80} />
                    </div>

                    {/* Verification Card */}
                    <Card
                        style={{
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px'
                        }}
                    >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div className="text-center">
                                <Title level={3} style={{ marginBottom: '8px' }}>
                                    <Space>
                                        <SafetyOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
                                        <span>Two-Factor Authentication</span>
                                    </Space>
                                </Title>
                                <Text type="secondary">
                                    Enter the 6-digit code sent to your email
                                </Text>
                            </div>

                            {countdown > 0 ? (
                                <Alert
                                    message="Verification Code Sent"
                                    description={`A verification code has been sent to ${user?.email || 'your email'}. Please check your inbox.`}
                                    type="info"
                                    icon={<MailOutlined />}
                                    showIcon
                                    style={{ marginBottom: '16px' }}
                                />
                            ) : (
                                <Alert
                                    message="Get Verification Code"
                                    description={`Click the button below to receive a verification code at ${user?.email || 'your email'}.`}
                                    type="info"
                                    icon={<MailOutlined />}
                                    showIcon
                                    style={{ marginBottom: '16px' }}
                                />
                            )}

                            {/* Send Code Button */}
                            <div className="mb-4">
                                <Button
                                    htmlType="button"
                                    type="primary"
                                    block
                                    size="large"
                                    onClick={handleSendCode}
                                    disabled={codeStatus?.status === Status.LOADING || countdown > 0}
                                    loading={codeStatus?.status === Status.LOADING}
                                    icon={<MailOutlined />}
                                    style={{
                                        height: '42px',
                                        fontSize: '15px',
                                        fontWeight: 500
                                    }}
                                >
                                    {codeStatus?.status === Status.LOADING 
                                        ? 'Sending Code...' 
                                        : countdown > 0 
                                        ? `Resend Code in ${countdown}s` 
                                        : 'Send Verification Code'}
                                </Button>
                            </div>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                className="[&_.ant-form-item]:mb-2 [&_.ant-form-item-label]:mb-0"
                            >
                                <Form.Item
                                    label={
                                        <Space>
                                            <SafetyOutlined style={{ color: '#1890ff' }} />
                                            <span className="text-gray-500 text-[15px] font-semibold">Enter Verification Code</span>
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
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        htmlType="submit"
                                        block
                                        size="large"
                                        type="primary"
                                        disabled={code.join('').length !== 6 || loading}
                                        loading={loading}
                                        icon={<CheckCircleOutlined />}
                                        className="bg-gradient-to-r from-[#194EAD] to-[#3793D2] border-none text-white"
                                        style={{
                                            height: '42px',
                                            fontSize: '15px',
                                            fontWeight: 500
                                        }}
                                    >
                                        {loading ? 'Verifying...' : 'Verify & Continue'}
                                    </Button>
                                </Form.Item>

                            </Form>

                            <div className="text-center mt-4">
                                <Button
                                    htmlType="button"
                                    type="link"
                                    onClick={() => router.push('/login')}
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </Space>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VerifyTwofaPage;

