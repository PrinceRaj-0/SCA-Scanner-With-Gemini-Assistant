import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default function ResultsTable({ data }) {
    if (!data || !data.Results) {
        return (
            <div className="text-center p-8 bg-black/20 backdrop-blur-md rounded-lg border border-white/10">
                <p className="text-cyber-green">Scan completed. No vulnerabilities found!</p>
            </div>
        )
    }

    // Flatten results for easier display, usually Trivy returns array of Targets
    const vulnerabilities = data.Results.flatMap(target =>
        (target.Vulnerabilities || []).map(v => ({ ...v, Target: target.Target }))
    );

    const downloadCSV = () => {
        if (vulnerabilities.length === 0) return;

        const headers = ['Vulnerability ID', 'Severity', 'Package', 'Installed Version', 'Fixed Version', 'Title', 'Target'];
        const csvContent = [
            headers.join(','),
            ...vulnerabilities.map(v => [
                v.VulnerabilityID,
                v.Severity,
                `"${v.PkgName}"`, // Quote to handle commas in names
                v.InstalledVersion,
                v.FixedVersion || 'N/A',
                `"${(v.Title || '').replace(/"/g, '""')}"`, // Escape quotes
                v.Target
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `trivy_scan_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (vulnerabilities.length === 0) {
        return (
            <div className="text-center p-8 bg-black/20 backdrop-blur-md rounded-lg border border-white/10">
                <p className="text-cyber-green font-bold text-xl">Clean Scan!</p>
                <p className="text-gray-400">No vulnerabilities detected in {data.ArtifactName}</p>
            </div>
        )
    }

    return (
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">
                    Findings for <span className="text-cyber-blue font-mono">{data.ArtifactName}</span>
                </h3>
                <div className="flex items-center gap-3">
                    <span className="bg-red-900/40 text-cyber-red px-3 py-1 rounded text-xs font-bold border border-red-900">
                        {vulnerabilities.length} Issues
                    </span>
                    <button
                        onClick={downloadCSV}
                        className="flex items-center gap-2 px-3 py-1 bg-cyber-green/10 text-cyber-green border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors text-sm font-medium"
                        title="Export to CSV"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-black/40">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Package</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Installed</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fixed In</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-transparent">
                        {vulnerabilities.map((v, idx) => (
                            <tr key={`${v.VulnerabilityID}-${idx}`} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-sm border ${v.Severity === 'HIGH' || v.Severity === 'CRITICAL' ? 'bg-red-900/20 text-red-500 border-red-900' :
                                        v.Severity === 'MEDIUM' ? 'bg-yellow-900/20 text-yellow-500 border-yellow-900' :
                                            'bg-blue-900/20 text-blue-400 border-blue-900'
                                        }`}>
                                        {v.Severity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                                    {v.VulnerabilityID}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {v.PkgName}
                                    <div className="text-xs text-gray-500">{v.Target}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                                    {v.InstalledVersion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-cyber-green font-mono">
                                    {v.FixedVersion || 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
