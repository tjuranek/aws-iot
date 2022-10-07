import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Card } from "flowbite-react";
import { EmployeeList } from "~/components/EmployeeList";
import { getEmployees } from "~/models/employee.server";

export async function loader() {
    const employees = await getEmployees();

    return json({ employees });
}

export default function Employees() {
    const { employees } = useLoaderData<typeof loader>();

    return (
        <section className="flex gap-2">
            <div className="grow">
                <Card>
                    <h3 className="text-xl">Employee List</h3>

                    <EmployeeList employees={employees} />
                </Card>
            </div>

            <div className="grow">
                <Card>
                    <Outlet />
                </Card>
            </div>
        </section>
    );
}