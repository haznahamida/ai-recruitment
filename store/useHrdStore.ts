
import { create } from 'zustand';
import { JobPosition, Candidate, MatchResult, GapAnalysisReport, Notification, ApplicationHistory, RecruitmentStage } from '../types';

const INITIAL_STAGES: RecruitmentStage[] = [
    { name: 'Screening', status: 'Belum' },
    { name: 'Psikotest', status: 'Belum' },
    { name: 'Interview HR', status: 'Belum' },
    { name: 'Interview User', status: 'Belum' },
    { name: 'Penawaran', status: 'Belum' },
];

// --- MOCK CANDIDATES ---
const MOCK_CANDIDATES: Candidate[] = [
    {
        id: 'cand1',
        user: { id: 'user1', name: 'Ahmad Prasetyo', email: 'ahmad.p@example.com', location: 'Bandung', role: 'candidate', onlineStatus: 'online', avatarUrl: 'https://i.pravatar.cc/150?u=ahmad.p@example.com' },
        positionApplied: 'Backend Developer (Golang)',
        salaryExpectation: { min: 12000000, max: 18000000 },
        workExperience: [{ id: 'we1', jobTitle: 'Software Engineer', companyName: 'Tech Innovators', startDate: '2020-01-01', endDate: '2023-12-31', description: 'Developed backend services with Go.' }],
        education: [{ id: 'edu1', institution: 'Institut Teknologi Bandung', degree: 'S.T.', fieldOfStudy: 'Teknik Informatika', startDate: '2016-08-01', endDate: '2020-06-30' }],
        skills: [{ id: 's1', name: 'Go', level: 'Advanced' }, { id: 's2', name: 'PostgreSQL', level: 'Intermediate' }, {id: 's-extra1', name: 'Microservices', level: 'Intermediate'}],
        documents: [
            { id: 'hrd-doc-ahmad-1', type: 'resume', name: 'Ahmad_Prasetyo_CV.pdf', url: '#', uploadedAt: '2024-05-10' },
        ],
        activity: [{ time: '2024-05-10', event: 'Melamar untuk posisi Backend Developer (Golang)' }],
        applicationHistory: [
            { id: 'app1', position: 'Backend Developer (Golang)', applied_date: '2024-05-10', status: 'Dalam Proses', stages: [...INITIAL_STAGES] },
        ],
    },
    {
        id: 'cand2',
        user: { id: 'user2', name: 'Citra Kirana', email: 'citra.k@example.com', location: 'Jakarta', role: 'candidate', onlineStatus: 'offline', avatarUrl: 'https://i.pravatar.cc/150?u=citra.k@example.com' },
        positionApplied: 'Senior Frontend Developer',
        salaryExpectation: { min: 15000000, max: 22000000 },
        workExperience: [{ id: 'we2', jobTitle: 'Frontend Developer', companyName: 'Digital Solutions', startDate: '2019-06-01', endDate: '2024-01-15', description: 'Built responsive UIs with React and TypeScript.' }],
        education: [{ id: 'edu2', institution: 'Universitas Indonesia', degree: 'S.Kom', fieldOfStudy: 'Ilmu Komputer', startDate: '2015-08-01', endDate: '2019-07-01' }],
        skills: [{ id: 's3', name: 'React', level: 'Advanced' }, { id: 's4', name: 'TypeScript', level: 'Advanced' }],
        documents: [],
        activity: [],
        applicationHistory: [
            { id: 'app3', position: 'Senior Frontend Developer', applied_date: '2024-05-08', status: 'Dalam Proses', stages: [...INITIAL_STAGES] },
        ],
    },
];

// --- MOCK MATCH RESULTS ---
const MOCK_MATCH_RESULTS: MatchResult[] = [
    { 
        candidate: MOCK_CANDIDATES[1], 
        fitScore: 92, 
        summary: "Sangat cocok, keahlian teknis sesuai dan pengalaman relevan.", 
        aiReason: "Direkomendasikan karena memiliki 5+ tahun pengalaman dengan React & TypeScript, sesuai dengan kualifikasi utama posisi Senior Frontend Developer.", 
        matchingAspects: { 
            meets: ["React (Advanced)", "TypeScript (Advanced)", "5+ tahun pengalaman", "Lokasi Jakarta"], 
            lacks: ["Pengalaman dengan GraphQL", "Pengalaman dengan Testing (Jest)"] 
        } 
    },
    { 
        candidate: MOCK_CANDIDATES[0], 
        fitScore: 75, 
        summary: "Cukup cocok, keahlian backend kuat namun perlu adaptasi ke frontend.", 
        aiReason: "Memiliki dasar pemrograman yang kuat di Go dan Microservices. Meskipun melamar frontend, Ahmad memiliki potensi belajar yang cepat.", 
        matchingAspects: { 
            meets: ["Pendidikan S1 TI", "Logika Pemrograman Kuat", "Pengalaman Kolaborasi Tim"], 
            lacks: ["React (Advanced)", "TypeScript (Advanced)", "CSS Frameworks"] 
        } 
    },
];

const MOCK_JOB_POSITIONS: JobPosition[] = [
    {
        id: 'job1', title: 'Senior Frontend Developer', company: 'AI Recruit', location: 'Remote', jobLevel: 'Mid-Senior', employmentType: 'Full Time', jobFunction: 'IT', education: 'Sarjana (S1)', salary: { min: 15000000, max: 25000000 }, postedDate: '2024-05-20', logoUrl: 'https://picsum.photos/seed/cortex/100/100', applicants: 25, status: 'Published',
        department: 'Engineering',
        requiredSkills: [{id: 'rs1', name: 'React', level: 'Advanced'}, {id: 'rs2', name: 'TypeScript', level: 'Advanced'}],
        jobDescription: 'Membangun dan memelihara fitur UI yang kompleks.',
        closingDate: '2025-06-30',
        openPositions: 2,
        requirements: { education: 'Sarjana (S1)', experience_years: 5, certifications: [], skills: ['React', 'TypeScript'] }
    },
    {
        id: 'job2', title: 'Backend Developer (Golang)', company: 'AI Recruit', location: 'Jakarta', jobLevel: 'Mid-Senior', employmentType: 'Full Time', jobFunction: 'IT', education: 'Sarjana (S1)', salary: { min: 16000000, max: 28000000 }, postedDate: '2024-05-18', logoUrl: 'https://picsum.photos/seed/cortex2/100/100', applicants: 18, status: 'Published',
        department: 'Engineering',
        requiredSkills: [{id: 'rs4', name: 'Go', level: 'Advanced'}],
        jobDescription: 'Merancang layanan backend yang skalabel.',
        closingDate: '2025-06-15',
        openPositions: 3,
        requirements: { education: 'Sarjana (S1)', experience_years: 4, certifications: [], skills: ['Go'] }
    }
];

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif1',
        category: 'ai-matching',
        title: 'Hasil AI Matching Tersedia',
        message: 'Hasil AI Matching tersedia untuk posisi "Senior Frontend Developer".',
        created_at: new Date().toISOString(),
        status: 'unread',
        target_page: '/hrd/matching',
    }
];

interface HrdState {
    loading: boolean;
    dashboardStats: { activeJobs: number; totalApplicants: number; avgFitScore: number; qualifiedCandidates: number; };
    jobPositions: JobPosition[];
    candidates: Candidate[];
    matchResults: MatchResult[];
    gapAnalysisReports: GapAnalysisReport[];
    notifications: Notification[];
    fetchDashboardStats: () => Promise<void>;
    runMatching: (jobId: string) => Promise<void>;
    fetchRanking: (jobId: string) => Promise<void>;
    runGapAnalysis: (jobId: string) => Promise<void>;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    getCandidateById: (id: string) => Candidate | undefined;
    getJobById: (id: string) => JobPosition | undefined;
    addJob: (job: JobPosition) => void;
    updateJob: (job: JobPosition) => void;
    closeJob: (id: string) => void;
    updateStageStatus: (candidateId: string, jobId: string, stageName: string, newStatus: RecruitmentStage['status']) => void;
}

export const useHrdStore = create<HrdState>((set, get) => ({
    loading: false,
    dashboardStats: { activeJobs: 0, totalApplicants: 0, avgFitScore: 0, qualifiedCandidates: 0 },
    jobPositions: MOCK_JOB_POSITIONS,
    candidates: MOCK_CANDIDATES,
    matchResults: [],
    gapAnalysisReports: [],
    notifications: MOCK_NOTIFICATIONS,

    fetchDashboardStats: async () => {
        set({ loading: true });
        await new Promise(res => setTimeout(res, 500));
        set({
            dashboardStats: { activeJobs: get().jobPositions.length, totalApplicants: 43, avgFitScore: 78, qualifiedCandidates: 12 },
            loading: false,
        });
    },

    runMatching: async (jobId) => {
        set({ loading: true, matchResults: [] });
        
        // Simulasi proses AI
        await new Promise(res => setTimeout(res, 2000));
        
        const results = MOCK_MATCH_RESULTS.sort((a, b) => b.fitScore - a.fitScore);
        
        // Update status 'Screening' pada daftar kandidat berdasarkan fitScore
        set(state => ({
            matchResults: results,
            candidates: state.candidates.map(candidate => {
                const matchInfo = results.find(m => m.candidate.id === candidate.id);
                if (!matchInfo) return candidate;

                // Tentukan status Screening: Lolos jika score >= 80, jika tidak Tidak Lolos
                const screeningStatus: RecruitmentStage['status'] = matchInfo.fitScore >= 80 ? 'Lolos' : 'Tidak Lolos';

                const updatedHistory = (candidate.applicationHistory || []).map(app => {
                    // Hanya update lamaran yang sesuai dengan posisi yang sedang di-match
                    // (Karena data mock terbatas, kita asumsikan update Screening stage)
                    const updatedStages = app.stages.map(stage => 
                        stage.name === 'Screening' ? { ...stage, status: screeningStatus } : stage
                    );

                    let overallStatus = app.status;
                    if (screeningStatus === 'Tidak Lolos') {
                        overallStatus = 'Ditolak';
                    }

                    return { ...app, stages: updatedStages, status: overallStatus };
                });

                return { ...candidate, applicationHistory: updatedHistory };
            }),
            loading: false 
        }));
    },

    fetchRanking: async (jobId) => {
        set({ loading: true });
        await new Promise(res => setTimeout(res, 500));
        set({ 
            matchResults: MOCK_MATCH_RESULTS.sort((a, b) => b.fitScore - a.fitScore),
            loading: false 
        });
    },

    runGapAnalysis: async (jobId) => {
        set({ loading: true, gapAnalysisReports: [] });
        await new Promise(res => setTimeout(res, 1500));
        
        const job = get().jobPositions.find(j => j.id === jobId);
        if (!job) {
            set({ loading: false });
            return;
        }

        const reports: GapAnalysisReport[] = MOCK_CANDIDATES.map(candidate => {
            const missing = job.requiredSkills.filter(reqSkill => 
                !candidate.skills.some(canSkill => canSkill.name === reqSkill.name)
            ).map(s => s.name);
            
            return {
                candidate,
                gapScore: missing.length * 20,
                missingCompetencies: missing.length > 0 ? missing : ["Tidak ada kesenjangan kompetensi utama"],
                trainingRecommendations: missing.map(skill => `Ambil kursus online untuk memperdalam keahlian ${skill}.`)
            };
        });

        set({ gapAnalysisReports: reports, loading: false });
    },

    markAsRead: (id) => set(state => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, status: 'read' } : n) })),
    markAllAsRead: () => set(state => ({ notifications: state.notifications.map(n => ({ ...n, status: 'read' })) })),
    getCandidateById: (id) => get().candidates.find(c => c.id === id),
    getJobById: (id) => get().jobPositions.find(j => j.id === id),
    addJob: (job) => set(state => ({ jobPositions: [...state.jobPositions, job] })),
    updateJob: (updatedJob) => set(state => ({ jobPositions: state.jobPositions.map(j => j.id === updatedJob.id ? updatedJob : j) })),
    closeJob: (id) => set(state => ({ jobPositions: state.jobPositions.map(j => j.id === id ? { ...j, status: 'Closed' } : j) })),

    updateStageStatus: (candidateId, jobId, stageName, newStatus) => {
        set(state => ({
            candidates: state.candidates.map(candidate => {
                if (candidate.id !== candidateId) return candidate;

                const updatedHistory = (candidate.applicationHistory || []).map(app => {
                    const updatedStages = app.stages.map(stage => 
                        stage.name === stageName ? { ...stage, status: newStatus } : stage
                    );

                    let overallStatus: ApplicationHistory['status'] = 'Dalam Proses';
                    const hasFailed = updatedStages.some(s => s.status === 'Tidak Lolos');
                    const penawaranLolos = updatedStages.find(s => s.name === 'Penawaran')?.status === 'Lolos';

                    if (hasFailed) {
                        overallStatus = 'Ditolak';
                    } else if (penawaranLolos) {
                        overallStatus = 'Diterima';
                    }

                    return { ...app, stages: updatedStages, status: overallStatus };
                });

                return { ...candidate, applicationHistory: updatedHistory };
            })
        }));
    }
}));
