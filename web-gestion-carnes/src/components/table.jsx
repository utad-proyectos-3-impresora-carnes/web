"use client";

import { Eye } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";

export default function Table({ data, loading }) {

    const router = useRouter();

    const viewCarnet = (id) => {
        console.log("Ver carnet de", id);
        router.push(`/dashboard/carnet/${id}`);
    }

    return (
        <div className="overflow-x-auto">
            {loading ? (
                <p className="content-center">Cargando...</p>
            ) : (
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Nombre</th>
                            <th className="border px-4 py-2">DNI</th>
                            <th className="border px-4 py-2">Edad</th>
                            <th className="border px-4 py-2 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <Eye className="w-5 h-5 text-gray-600" />
                                    <input type="checkbox" className="w-5 h-5 cursor-pointer" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((member) => (
                            <tr key={member.id}>
                                <td className="border px-4 py-2">{member.fullName}</td>
                                <td className="border px-4 py-2">{member.dni}</td>
                                <td className="border px-4 py-2">{member.group.name}</td>
                                <td className="border px-4 py-2 text-right">
                                    <div className="flex items-center justify-end gap-3">  
                                        {/* Visualiza carnet */}
                                        <button onClick={() => viewCarnet(member._id)}>
                                        <Eye className="w-5 h-5 text-gray-600 cursor-pointer" />
                                        </button>
                                        <input type="checkbox" className="w-5 h-5 cursor-pointer" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
