
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Modal } from "flowbite-react";
import { getJobDetails } from "~/models/jobs.server";

export async function loader({ params }: LoaderArgs) {
    const jobId = Number(params.jobId)
    invariant(jobId, 'Machine id is required.');

    const jobDetails = await getJobDetails(jobId); 
    invariant(jobDetails, 'Machine details not found.');

    return json({ jobDetails });
}

export default function JobsJobId() {
    const { jobDetails } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    function onClose() {
        navigate("/jobs");
    }

    return (
        <Modal show={true} onClose={onClose}>
            <Modal.Header>
                {jobDetails.name}
            </Modal.Header>

            <Modal.Body>
                <h4 className="text-lg">Employee</h4>
                <p><b>Name:</b> {jobDetails.employee.name}</p>
                <p><b>Postion</b> {jobDetails.employee.position}</p>

                <h4 className="text-lg">Machine</h4>
                <p><b>Name:</b> {jobDetails.machine.nickname}</p>
            </Modal.Body>
        </Modal> 
    );
}