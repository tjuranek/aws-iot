import { Link, Outlet } from "@remix-run/react";
import { Footer, Navbar } from "flowbite-react";

export default function App() {
    return (
        <>
            <Navbar>
                <Navbar.Brand>
                    <Link to="/dashboard">
                        <h1 className="text-xl font-bold">Printster</h1>
                    </Link>
                </Navbar.Brand>

                <Navbar.Toggle />

                <Navbar.Collapse>
                    <Navbar.Link>
                        <Link to="/dashboard" prefetch="intent">
                            Dashboard
                        </Link>
                    </Navbar.Link>

                    <Navbar.Link>
                        <Link to="/employees" prefetch="intent">
                            Employees
                        </Link>
                    </Navbar.Link>

                    <Navbar.Link>
                        <Link to="/jobs" prefetch="intent">
                            Jobs
                        </Link>
                    </Navbar.Link>

                    <Navbar.Link>
                        <Link to="/machines" prefetch="intent">
                            Machines 
                        </Link>
                    </Navbar.Link>
                </Navbar.Collapse>
            </Navbar>

            <main className="mx-[15%] my-4">
                <Outlet />
            </main>

            <div className="fixed bottom-0 left-0">
                <Footer container={true}>
                    <div className="text-center w-screen">
                        <Footer.Copyright
                            href="/dashboard"
                            by="Printster"
                            year={2022}
                        />
                    </div>
                </Footer>
            </div>
        </>
    );
}