import { Outlet } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import AppFooter from "../components/layout/AppFooter";

export default function Layout(){
    return (
        <>
            <div className="flex flex-col min-vh-100">
                <AppHeader/>
                <main className="flex-grow">
                    <Outlet/>
                </main>
                <AppFooter/>
            </div>
        </>
    );
}