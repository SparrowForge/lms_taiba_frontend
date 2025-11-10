"use client"

import { Button, Card, Form, Input, Modal, Typography } from 'antd';  

import { useTwofa } from '@/hooks/useTwofa';

import { toast } from 'react-toastify' ;

import { getErrorMessage } from '@/types/errors';

import { useAuth } from '@/hooks/useAuth';

import { useSelector } from 'react-redux';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const { Text } = Typography

const VerifyModalTwofa: React.FC = ({setVerifyTwofa,twoFaState}) => {
    const { user } = useAuth();
    const router = useRouter()

    const { loading,  } = useSelector(
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

      const { verifyMailTwofa } = useTwofa()

      const onFinish = async(type: "mail" | "app") => {
          const data = {
              email:user?.email,
              code:code.join('')
          }
          console.log(data)
          try {
              await verifyMailTwofa(data)
              setVerifyTwofa(false)
              
          } catch (error) {
              console.error('Activation Failed:', error);
              toast.error(getErrorMessage(error) || 'Activationap failed!');
          }
      };

  return (
    <>
      
      
      <Modal
        title="Mail 2FA"
        centered
        open={twoFaState}
      >
         <Card  style={{ width: 450, height: 300 }}>
                <Text>
                    <b>Verify Your Code that sent to your Email</b>
                </Text>
               
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
                                autoFocus={index === 0}
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
                                {loading ? "Verifying..." : "Verify"}
                        </Button>
                    </Form.Item>
                </Form>
          </Card>
      </Modal>
    </>
  );
};

export default VerifyModalTwofa;