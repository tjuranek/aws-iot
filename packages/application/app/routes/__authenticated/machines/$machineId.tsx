import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getMachineDetails } from "~/models/machines.server";
import { Modal } from "flowbite-react";

export async function loader({ params }: LoaderArgs) {
    const machineId = Number(params.machineId)
    invariant(machineId, 'Machine id is required.');

    const machineDetails = await getMachineDetails(machineId); 
    invariant(machineDetails, 'Machine details not found.');

    return json({ machineDetails });
}

export default function MachinesMachineId() {
    const { machineDetails } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    function onClose() {
        navigate("/machines");
    }

    return (
        <Modal show={true} onClose={onClose}>
            <Modal.Header>
                {machineDetails.nickname}
            </Modal.Header>

            <Modal.Body>
                <h4 className="text-lg">Details</h4>
                <p><b>Model:</b> {machineDetails.model}</p>
                <p><b>Type:</b> {machineDetails.type.name}</p>

                {!!machineDetails.jobs.length && (<h4 className="text-lg">Job History</h4>)}
                {machineDetails.jobs.map((job) => (
                    <p>{job.name}</p>
                ))}
            </Modal.Body>
        </Modal> 
    );
}