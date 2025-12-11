

import { create } from 'zustand';
import { JobPosition, Candidate, MatchResult, GapAnalysisReport, Notification, ApplicationHistory } from '../types';

// --- MOCK DATA ---
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
            { id: 'hrd-doc-ahmad-2', type: 'certificate', name: 'Sertifikat_Go_Advanced.pdf', url: '#', uploadedAt: '2024-05-11' },
        ],
        activity: [
            { time: '2024-05-10', event: 'Melamar untuk posisi Backend Developer (Golang)' },
            { time: '2024-05-11', event: 'Mengunggah sertifikat baru' },
        ],
        applicationHistory: [
            { id: 'app1', position: 'Backend Developer (Golang)', applied_date: '2024-05-10', status: 'Dalam Proses', stages: [{ name: 'Screening', status: 'Dalam Proses' }, { name: 'Psikotest', status: 'Belum'}, { name: 'Interview HR', status: 'Belum'}, { name: 'Interview User', status: 'Belum' }, { name: 'Penawaran', status: 'Belum' }] },
            { id: 'app2', position: 'Junior Backend Engineer', applied_date: '2023-11-20', status: 'Ditolak', stages: [{ name: 'Screening', status: 'Lolos' }, { name: 'Psikotest', status: 'Tidak Lolos' }, { name: 'Interview HR', status: 'Belum' }, { name: 'Interview User', status: 'Belum' }, { name: 'Penawaran', status: 'Belum' }] },
        ],
    },
    {
        id: 'cand2',
        user: { id: 'user2', name: 'Citra Kirana', email: 'citra.k@example.com', location: 'Jakarta', role: 'candidate', onlineStatus: 'offline', avatarUrl: 'https://i.pravatar.cc/150?u=citra.k@example.com' },
        positionApplied: 'Senior Frontend Developer',
        salaryExpectation: { min: 15000000, max: 22000000 },
        workExperience: [{ id: 'we2', jobTitle: 'Frontend Developer', companyName: 'Digital Solutions', startDate: '2019-06-01', endDate: '2024-01-15', description: 'Built responsive UIs with React and TypeScript.' }],
        education: [{ id: 'edu2', institution: 'Universitas Indonesia', degree: 'S.Kom', fieldOfStudy: 'Ilmu Komputer', startDate: '2015-08-01', endDate: '2019-07-01' }],
        skills: [{ id: 's3', name: 'React', level: 'Advanced' }, { id: 's4', name: 'TypeScript', level: 'Advanced' }, { id: 's5', name: 'Figma', level: 'Intermediate' }],
        documents: [
            { id: 'hrd-doc-citra-1', type: 'resume', name: 'Citra_Kirana_Resume_2024.pdf', url: '#', uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() }
        ],
        activity: [
            { time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), event: 'Mengunggah berkas baru (resume)' },
            { time: '2024-05-09', event: 'Profil Dilihat oleh HRD' },
        ],
        applicationHistory: [
            { id: 'app3', position: 'Senior Frontend Developer', applied_date: '2024-05-08', status: 'Interview', stages: [{ name: 'Screening', status: 'Lolos' }, { name: 'Psikotest', status: 'Lolos' }, { name: 'Interview HR', status: 'Dalam Proses' }, { name: 'Interview User', status: 'Belum' }, { name: 'Penawaran', status: 'Belum' }] },
            { id: 'app4', position: 'Frontend Developer', applied_date: '2023-01-15', status: 'Diterima', stages: [{ name: 'Screening', status: 'Lolos' }, { name: 'Psikotest', status: 'Lolos' }, { name: 'Interview HR', status: 'Lolos' }, { name: 'Interview User', status: 'Lolos' }, { name: 'Penawaran', status: 'Lolos' }] },
        ],
    },
     {
        id: 'cand3',
        user: { id: 'user3', name: 'Dewi Lestari', email: 'dewi.l@example.com', location: 'Surabaya', role: 'candidate', onlineStatus: 'online', avatarUrl: 'https://i.pravatar.cc/150?u=dewi.l@example.com' },
        positionApplied: 'UI/UX Designer',
        salaryExpectation: { min: 10000000, max: 14000000 },
        workExperience: [{ id: 'we3', jobTitle: 'Junior Backend Engineer', companyName: 'Startup Maju', startDate: '2022-01-10', endDate: '', description: 'Maintained and added features to Node.js backend systems.' }],
        education: [{ id: 'edu3', institution: 'Universitas Airlangga', degree: 'S.Kom', fieldOfStudy: 'Sistem Informasi', startDate: '2018-09-01', endDate: '2021-12-20' }],
        skills: [{ id: 's6', name: 'Node.js', level: 'Intermediate' }, { id: 's7', name: 'MongoDB', level: 'Intermediate' }],
        documents: [],
        activity: [{ time: '2024-05-12', event: 'Mendaftar ke sistem' }],
        applicationHistory: [
            { id: 'app5', position: 'UI/UX Designer', applied_date: '2024-05-12', status: 'Pending', stages: [{ name: 'Screening', status: 'Pending' }, { name: 'Psikotest', status: 'Belum' }, { name: 'Interview HR', status: 'Belum' }, { name: 'Interview User', status: 'Belum' }, { name: 'Penawaran', status: 'Belum' }] },
        ],
    }
];

const MOCK_JOB_POSITIONS: JobPosition[] = [
    {
        id: 'job1', title: 'Senior Frontend Developer', company: 'AI Recruit', location: 'Remote', jobLevel: 'Mid-Senior', employmentType: 'Full Time', jobFunction: 'IT', education: 'Sarjana (S1)', salary: { min: 15000000, max: 25000000 }, postedDate: '2024-05-20', logoUrl: 'https://picsum.photos/seed/cortex/100/100', applicants: 25, status: 'Published',
        department: 'Engineering',
        requiredSkills: [{id: 'rs1', name: 'React', level: 'Advanced'}, {id: 'rs2', name: 'TypeScript', level: 'Advanced'}, {id: 'rs3', name: 'State Management', level: 'Advanced'}],
        jobDescription: 'Membangun dan memelihara fitur UI yang kompleks untuk platform kami.',
        closingDate: '2025-06-30',
        openPositions: 2,
        requirements: {
            education: 'Sarjana (S1)',
            experience_years: 5,
            certifications: [],
            skills: ['React', 'TypeScript', 'State Management']
        }
    },
    {
        id: 'job2', title: 'Backend Developer (Golang)', company: 'AI Recruit', location: 'Jakarta', jobLevel: 'Mid-Senior', employmentType: 'Full Time', jobFunction: 'IT', education: 'Sarjana (S1)', salary: { min: 16000000, max: 28000000 }, postedDate: '2024-05-18', logoUrl: 'https://picsum.photos/seed/cortex2/100/100', applicants: 18, status: 'Published',
        department: 'Engineering',
        requiredSkills: [{id: 'rs4', name: 'Go', level: 'Advanced'}, {id: 'rs5', name: 'Microservices', level: 'Intermediate'}, {id: 'rs6', name: 'PostgreSQL', level: 'Intermediate'}],
        jobDescription: 'Merancang dan mengimplementasikan layanan backend yang skalabel.',
        closingDate: '2025-06-15',
        openPositions: 3,
        requirements: {
            education: 'Sarjana (S1)',
            experience_years: 4,
            certifications: [],
            skills: ['Go', 'Microservices', 'PostgreSQL']
        }
    },
    {
        id: 'job3', title: 'UI/UX Designer', company: 'AI Recruit', location: 'Bandung', jobLevel: 'Associate', employmentType: 'Full Time', jobFunction: 'IT', education: 'Sarjana (S1)', salary: { min: 10000000, max: 18000000 }, postedDate: '2024-05-15', logoUrl: 'https://picsum.photos/seed/cortex3/100/100', applicants: 32, status: 'Published',
        department: 'Product',
        requiredSkills: [{id: 'rs7', name: 'Figma', level: 'Advanced'}, {id: 'rs8', name: 'User Research', level: 'Intermediate'}],
        jobDescription: 'Mendesain antarmuka pengguna yang intuitif dan menarik.',
        closingDate: '2025-05-30',
        openPositions: 1,
        requirements: {
            education: 'Sarjana (S1)',
            experience_years: 2,
            certifications: [],
            skills: ['Figma', 'User Research']
        }
    }
];

const MOCK_MATCH_RESULTS: MatchResult[] = [
    { candidate: MOCK_CANDIDATES[1], fitScore: 92, summary: "Sangat cocok, keahlian teknis sesuai dan pengalaman relevan.", aiReason: "Direkomendasikan karena memiliki 5+ tahun pengalaman dengan React & TypeScript, sesuai dengan kualifikasi utama.", matchingAspects: { meets: ["React (Advanced)", "TypeScript (Advanced)", "5+ tahun pengalaman"], lacks: ["Pengalaman dengan GraphQL"] }},
    { candidate: MOCK_CANDIDATES[0], fitScore: 75, summary: "Cukup cocok, keahlian backend kuat namun perlu adaptasi.", aiReason: "Memiliki dasar pemrograman yang kuat di Go, namun posisi yang dibuka adalah Frontend. Memiliki potensi untuk belajar cepat.", matchingAspects: { meets: ["Pendidikan S1 TI", "Logika Pemrograman Kuat"], lacks: ["React (Advanced)", "TypeScript (Advanced)"] }},
    { candidate: MOCK_CANDIDATES[2], fitScore: 68, summary: "Kurang cocok, pengalaman masih junior.", aiReason: "Pengalaman kerja kurang dari 3 tahun dan level keahlian masih di tingkat menengah, belum memenuhi kualifikasi senior.", matchingAspects: { meets: ["Pendidikan S1", "Familiar dengan JavaScript"], lacks: ["Pengalaman 5+ tahun", "React (Advanced)"] }},
];

const unsortedNotifications: Notification[] = [
    {
        id: 'notif1',
        category: 'ai-matching',
        title: 'Hasil AI Matching Tersedia',
        message: 'Hasil AI Matching tersedia untuk posisi "UI/UX Designer".',
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        status: 'unread',
        target_page: '/hrd/matching?position=UI%2FUX%20Designer',
    },
    {
        id: 'notif2',
        category: 'new-candidate',
        title: '5 Kandidat Baru Mendaftar',
        message: '5 kandidat baru mendaftar untuk posisi "Senior Frontend Developer".',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: 'unread',
        target_page: '/hrd/kandidat?position=Senior%20Frontend%20Developer',
    },
    {
        id: 'notif3',
        category: 'document-update',
        title: 'Kandidat Mengunggah Berkas',
        message: 'Kandidat Citra Kirana mengunggah berkas baru.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        status: 'read',
        target_page: '/hrd/kandidat/cand2?highlight=document',
        target_candidate_id: 'cand2',
        target_type: 'document'
    },
    {
        id: 'notif4',
        category: 'job-alert',
        title: 'Lowongan Segera Berakhir',
        message: 'Batas waktu lowongan "Digital Marketing Intern" akan berakhir dalam 3 hari.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        status: 'read',
        target_page: '/hrd/dashboard',
    },
    {
        id: 'notif5',
        category: 'application-update',
        title: 'Update Status Lamaran',
        message: 'Status lamaran Citra Kirana untuk "Senior Frontend Developer" diubah ke Interview.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        status: 'unread',
        target_page: '/hrd/kandidat/cand2?highlight=application_history',
        target_candidate_id: 'cand2',
        target_type: 'application_history'
    }
];

const MOCK_NOTIFICATIONS = unsortedNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

interface HrdState {
    loading: boolean;
    dashboardStats: {
        activeJobs: number;
        totalApplicants: number;
        avgFitScore: number;
        qualifiedCandidates: number;
    };
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
    addJob: (job: JobPosition) => void;
    updateJob: (job: JobPosition) => void;
    closeJob: (id: string) => void;
    getJobById: (id: string) => JobPosition | undefined;
}

export const useHrdStore = create<HrdState>((set, get) => ({
    loading: false,
    dashboardStats: {
        activeJobs: 0,
        totalApplicants: 0,
        avgFitScore: 0,
        qualifiedCandidates: 0,
    },
    jobPositions: MOCK_JOB_POSITIONS, // Initialize with MOCK data immediately to prevent empty list on first render
    candidates: MOCK_CANDIDATES,
    matchResults: [],
    gapAnalysisReports: [],
    notifications: MOCK_NOTIFICATIONS,

    fetchDashboardStats: async () => {
        set({ loading: true });
        await new Promise(res => setTimeout(res, 500));
        set({
            dashboardStats: {
                activeJobs: get().jobPositions.length,
                totalApplicants: 43,
                avgFitScore: 78,
                qualifiedCandidates: 12,
            },
            // jobPositions: MOCK_JOB_POSITIONS, // Don't overwrite if we have local changes
            loading: false,
        });
    },

    runMatching: async (jobId) => {
        set({ loading: true, matchResults: [] });
        await new Promise(res => setTimeout(res, 2000)); // Simulate AI processing time
        set({
            matchResults: MOCK_MATCH_RESULTS.sort((a, b) => b.fitScore - a.fitScore),
            loading: false,
        });
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
                !candidate.skills.some(canSkill => canSkill.name === reqSkill.name && canSkill.level === reqSkill.level)
            ).map(s => `${s.name} (${s.level})`);
            
            return {
                candidate,
                gapScore: missing.length * 20, // Simple gap scoring
                missingCompetencies: missing.length > 0 ? missing : ["Tidak ada kesenjangan kompetensi utama"],
                trainingRecommendations: missing.map(skill => `Ambil kursus online untuk ${skill}.`)
            };
        });

        set({ gapAnalysisReports: reports, loading: false });
    },
    
    markAsRead: (id: string) => {
        set((state) => ({
            notifications: state.notifications.map(notif =>
                notif.id === id ? { ...notif, status: 'read' } : notif
            ),
        }));
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map(notif => ({ ...notif, status: 'read' }))
        }));
    },
    
    getCandidateById: (id: string) => {
        return get().candidates.find(c => c.id === id);
    },

    getJobById: (id: string) => {
        return get().jobPositions.find(j => j.id === id);
    },

    addJob: (job: JobPosition) => {
        set(state => ({
            jobPositions: [...state.jobPositions, job]
        }));
        
        // Mocking the backend call output as requested
        const backendPayload = {
            title: job.title,
            department: job.department,
            location: job.location,
            type: job.employmentType,
            description: job.jobDescription,
            requirements: job.requirements,
            salary_range: job.salary,
            closing_date: job.closingDate,
            open_positions: job.openPositions,
            status: job.status?.toLowerCase()
        };
        console.log("POST /jobs", JSON.stringify(backendPayload, null, 2));
    },

    updateJob: (updatedJob: JobPosition) => {
        set(state => ({
            jobPositions: state.jobPositions.map(job => job.id === updatedJob.id ? updatedJob : job)
        }));
    },

    closeJob: (id: string) => {
        set(state => ({
            jobPositions: state.jobPositions.map(job => job.id === id ? { ...job, status: 'Closed' } : job)
        }));
    }
}));