import { Tabs } from "expo-router"

export default () => {
    return (
        <Tabs>
            <Tabs.Screen name="Profile" />
            <Tabs.Screen name="Settings" />
        </Tabs>
    )
}