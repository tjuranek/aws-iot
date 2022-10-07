import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Card } from "flowbite-react";
import { getJobs } from "~/models/jobs.server";

export async function loader() {
    const jobs = await getJobs();

    return json({ jobs });
}

export default function Jobs() {
    const { jobs } = useLoaderData<typeof loader>();

    return (
        <>
            <Outlet />

            <div className="flex flex-col gap-2">
                {jobs.map((job) => (
                    <Link to={`/jobs/${job.id}`} prefetch="intent">
                        <Card>
                            <h3>{job.name}</h3>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    );
}