import { useTwofa } from "@/hooks/useTwofa";
import { AppDispatch, RootState } from "@/store";
import { Button, Card, message, Typography } from "antd"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const { Text } = Typography
const AuthSettings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, status, error } = useSelector(
        (state: RootState) => state.twofa
    );
    const [qrCodeView, setQrCodeView] = useState<boolean>(false)
    const [data, setData] = useState<string>("")
    
    const { 
        activateAppTwofa,
        deactivateAppTwofa,
    } = useTwofa()


    const handleActivate = (type: "mail" | "app") => {
        dispatch(activateAppTwofa)
            .then(() => message.success(`${type} 2FA activated successfully!`))
            .catch(() => message.error(`Failed to activate ${type} 2FA`));
    };

    const handleDeactivate = (type: "mail" | "app") => {
        dispatch(deactivateAppTwofa)
            .then(() => message.success(`${type} 2FA deactivated successfully!`))
            .catch(() => message.error(`Failed to deactivate ${type} 2FA`));
    };
    return (
        <div>
            {/* Google Authenticator 2FA */}
            <Card title="Google Authenticator" style={{ width: '100%', maxWidth: 450, minHeight: 350 }}>
                <Text>
                    Status:{" "}
                    <b>{status.app ? "Activated" : "Deactivated"}</b>
                </Text>
                <div className="mt-3">
                    {status.app ? (
                        <Button danger onClick={() => handleDeactivate("app")}>
                            Deactivate
                        </Button>
                    ) : (
                        <Button type="primary" onClick={() => handleActivate("app")}>
                            Activate
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default AuthSettings
