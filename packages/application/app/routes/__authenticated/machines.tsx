import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Card } from "flowbite-react";
import { getMachines } from "~/models/machines.server";

export async function loader() {
    const machines = await getMachines();

    return json({ machines });
}

export default function Machines() {
    const { machines } = useLoaderData<typeof loader>();

    return (
        <>
            <Outlet />

            <div className="flex flex-col gap-2">
                {machines.map((machine) => (
                    <Link to={`/machines/${machine.id}`}>
                        <Card>
                            <h3>{machine.nickname}</h3>
                            <p>Model: {machine.model}</p>
                            <p>Type: {machine.type.name}</p>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    );
}