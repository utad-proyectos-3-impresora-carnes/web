"use client";

export default function Table({data, loading}) {

    return (
        <div className="overflow-x-auto">

            {loading? (
                <p className="content-center">Cargando...</p>
            ) : (

            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Nombre: </th>
                        <th className="border px-4 py-2">Dni:</th>
                        <th className="border px-4 py-2">Edad</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((member) => (
                        <tr key={member.id}>
                            <td className="border px-4 py-2">{member.fullName}</td>
                            <td className="border px-4 py-2">{member.dni}</td>
                            <td className="border px-4 py-2">{member.group.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>

    );

}