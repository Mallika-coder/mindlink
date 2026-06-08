// src/data/assessments.js

export const ASSESSMENTS = {
    gad7: {
        id: 'gad7',
        title: 'Generalized Anxiety Disorder (GAD-7)',
        description: 'A screening tool for signs of anxiety.',
        questions: [
            "Feeling nervous, anxious, or on edge",
            "Not being able to stop or control worrying",
            "Worrying too much about different things",
            "Trouble relaxing",
            "Being so restless that it is hard to sit still",
            "Becoming easily annoyed or irritable",
            "Feeling afraid as if something awful might happen"
        ],
        scoring: [
            { min: 0, max: 4, label: "Minimal Anxiety", color: "text-green-500", bg: "bg-green-100" },
            { min: 5, max: 9, label: "Mild Anxiety", color: "text-yellow-500", bg: "bg-yellow-100" },
            { min: 10, max: 14, label: "Moderate Anxiety", color: "text-orange-500", bg: "bg-orange-100" },
            { min: 15, max: 21, label: "Severe Anxiety", color: "text-red-500", bg: "bg-red-100" }
        ]
    },
    phq9: {
        id: 'phq9',
        title: 'Patient Health Questionnaire (PHQ-9)',
        description: 'A screening tool for signs of depression.',
        questions: [
            "Little interest or pleasure in doing things",
            "Feeling down, depressed, or hopeless",
            "Trouble falling or staying asleep, or sleeping too much",
            "Feeling tired or having little energy",
            "Poor appetite or overeating",
            "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
            "Trouble concentrating on things, such as reading the newspaper or watching television",
            "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
            "Thoughts that you would be better off dead or of hurting yourself in some way"
        ],
        scoring: [
            { min: 0, max: 4, label: "Minimal Depression", color: "text-green-500", bg: "bg-green-100" },
            { min: 5, max: 9, label: "Mild Depression", color: "text-yellow-500", bg: "bg-yellow-100" },
            { min: 10, max: 14, label: "Moderate Depression", color: "text-orange-500", bg: "bg-orange-100" },
            { min: 15, max: 19, label: "Moderately Severe Depression", color: "text-orange-600", bg: "bg-orange-200" },
            { min: 20, max: 27, label: "Severe Depression", color: "text-red-500", bg: "bg-red-100" }
        ]
    }
};
