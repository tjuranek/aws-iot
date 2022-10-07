import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getEmployeeDetails } from "~/models/employee.server";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderArgs) {
    const employeeId = Number(params.employeeId)
    invariant(employeeId, 'Employee id is required.');

    const employeeDetails = await getEmployeeDetails(employeeId); 
    invariant(employeeDetails, 'Employee details not found.');

    return json({ employeeDetails });
}

export default function EmployeeId() {
    const { employeeDetails } = useLoaderData<typeof loader>();

    return (
        <>
            <p>{employeeDetails.id}</p>
            <p>{employeeDetails.name}</p>
            <p>{employeeDetails.position}</p>
        </>
    );
}