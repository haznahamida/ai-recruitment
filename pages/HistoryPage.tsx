
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApplicationHistory, Profile, RecruitmentStage } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';

const mockProfile: Profile = {
    user: { id: '1', name: 'Budi Doremi', email: 'budi.doremi@example.com', location: 'Jakarta, Indonesia', onlineStatus: 'online', role: 'candidate' },
    salaryExpectation: { min: 10000000, max: 15000000 },
    workExperience: [],
    education: [],
    skills: [],
    applicationHistory: [
        { 
            id: 'app_hist_5', position: 'Product Manager', company: 'Sumber Sukses', applied_date: '2024-06-15', status: 'Dalam Proses',
            stages: [
                { name: 'Screening', status: 'Lolos' },
                { name: 'Psikotest', status: 'Belum' },
                { name: 'Interview HR', status: 'Belum' },
                { name: 'Interview User', status: 'Belum' },
                { name: 'Penawaran', status: 'Belum' },
            ]
        },
        { 
            id: 'app_hist_2', position: 'Frontend Developer', company: 'AstraPay', applied_date: '2023-01-15', status: 'Ditolak',
            stages: [
                { name: 'Screening', status: 'Lolos' },
                { name: 'Psikotest', status: 'Lolos' },
                { name: 'Interview HR', status: 'Tidak Lolos' },
                { name: 'Interview User', status: 'Belum' },
                { name: 'Penawaran', status: 'Belum' },
            ]
        }
    ],
};


const HistoryPage: React.FC = () => {
    const [applications, setApplications] = useState<ApplicationHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        setTimeout(() => {
            const history = mockProfile.applicationHistory || [];
            const sortedHistory = [...history].sort((a, b) => new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime());
            setApplications(sortedHistory);
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        if (loading) return;
        const highlightParam = searchParams.get('highlight');
        if (!highlightParam) return;
        
        const highlightId = highlightParam.replace('application-', '');
        const element = document.getElementById(`application-${highlightId}`);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('highlight-section');
                setTimeout(() => element.classList.remove('highlight-section'), 3000);
            }, 100);
        }
    }, [loading, searchParams]);
    
    const getStageStyling = (status: RecruitmentStage['status']) => {
        switch (status) {
            case 'Lolos':
                return { bullet: 'bg-green-500', line: 'bg-green-500', text: 'text-green-700 font-semibold' };
            case 'Tidak Lolos':
                return { bullet: 'bg-red-500', line: 'bg-red-500', text: 'text-red-700 font-semibold' };
            case 'Belum':
            default:
                return { bullet: 'bg-gray-400', line: 'bg-gray-300', text: 'text-gray-500' };
        }
    };
    
    const getOverallStatusInfo = (status: ApplicationHistory['status']) => {
        switch (status) {
            case 'Diterima': return { text: status, color: 'text-green-700 bg-green-100' };
            case 'Interview': return { text: "Tahap Interview", color: 'text-green-700 bg-green-100' };
            case 'Ditolak': return { text: status, color: 'text-red-700 bg-red-100' };
            case 'Dalam Proses': return { text: status, color: 'text-yellow-700 bg-yellow-100' };
            default: return { text: status, color: 'text-gray-700 bg-gray-200' };
        }
    };

    if (loading) return <div className="p-8 text-center">Memuat riwayat lamaran...</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Riwayat Lamaran</h1>
                <p className="text-gray-500 mt-1">Lacak semua status lamaran pekerjaan Anda di sini.</p>
            </header>
            
            <div className="space-y-8">
                {applications.map(app => {
                    const overallStatus = getOverallStatusInfo(app.status);
                    let failed = false;
                    return (
                        <div key={app.id} id={`application-${app.id}`} className="bg-white shadow-md rounded-xl p-6 transition-colors duration-300">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{app.position}</h2>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                                        {app.company && <span className="flex items-center gap-1.5"><BriefcaseIcon className="h-4 w-4" />{app.company}</span>}
                                        <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" />Dilamar pada {format(new Date(app.applied_date), 'dd MMMM yyyy', { locale: id })}</span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                    <p className="text-xs text-gray-500 mb-2">Status Akhir</p>
                                    <span className={`px-3 py-1.5 rounded-full font-semibold text-sm ${overallStatus.color}`}>{overallStatus.text}</span>
                                </div>
                            </div>

                            <div className="mt-6 overflow-x-auto pb-4">
                                <div className="flex items-start min-w-max">
                                    {app.stages.map((stage, index) => {
                                        if (stage.status === 'Tidak Lolos') failed = true;
                                        const isInactive = failed && stage.status !== 'Tidak Lolos' && stage.status !== 'Lolos';
                                        const currentStyling = getStageStyling(isInactive ? 'Belum' : stage.status);
                                        const lineBgClass = (stage.status === 'Lolos' && !failed) ? getStageStyling('Lolos').line : getStageStyling('Belum').line;

                                        return (
                                            <React.Fragment key={stage.name}>
                                                <div className="flex flex-col items-center flex-shrink-0 w-28 rounded-md p-1 transition-colors duration-300">
                                                    <div className={`w-4 h-4 rounded-full ${currentStyling.bullet}`}></div>
                                                    <p className={`text-center font-semibold text-xs mt-2 ${isInactive ? 'text-gray-400' : 'text-gray-800'}`}>{stage.name}</p>
                                                    <p className={`text-center text-xs mt-1 ${isInactive ? 'text-gray-400' : currentStyling.text}`}>{stage.status}</p>
                                                </div>
                                                {index < app.stages.length - 1 && (
                                                    <div className={`flex-1 h-0.5 mt-2 ${lineBgClass}`}></div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HistoryPage;
