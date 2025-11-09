import { useTwofa } from "@/hooks/useTwofa";
import { AppDispatch, RootState } from "@/store";
import { Button, Card, message, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Text } = Typography

const MailSettings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, status, error } = useSelector(
        (state: RootState) => state.twofa
    );

      const [mailCodeView, setMailCodeView] = useState<boolean>(false)
      const [data, setData] = useState<string>("")

    const { loadTwofaStatus,
        activateAppTwofa,
        deactivateAppTwofa,
        activateMailTwofa,
        deactivateMailTwofa, } = useTwofa()
    useEffect(() => {
        dispatch(loadTwofaStatus);
    }, [dispatch]);

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
            {/* Mail 2FA */}
            <Card title="Mail 2FA" style={{ width: 450, height: 600 }}>
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
                        <Button type="primary" onClick={() => handleActivate("mail")}>
                            Activate
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default MailSettings
