import { format, subDays, differenceInDays, startOfWeek, eachDayOfInterval } from "date-fns";

export const MOOD_EMOJIS = [
  { score: 1, emoji: "😢", label: "Terrible", color: "#ef4444" },
  { score: 2, emoji: "😟", label: "Bad", color: "#f97316" },
  { score: 3, emoji: "😐", label: "Okay", color: "#eab308" },
  { score: 4, emoji: "🙂", label: "Good", color: "#22c55e" },
  { score: 5, emoji: "😊", label: "Great", color: "#06b6d4" },
];

export function calculateStreak(moods) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const key = format(subDays(today, i), "yyyy-MM-dd");
    if (moods.find((m) => m.date === key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

export function getMoodTrend(moods, days = 7) {
  const result = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(today, i), "yyyy-MM-dd");
    const mood = moods.find((m) => m.date === date);
    result.push({
      date,
      day: format(subDays(today, i), "EEE"),
      score: mood?.score || null,
      note: mood?.note || null,
    });
  }
  return result;
}

export function getWeeklyAverage(moods) {
  const last7 = moods.filter((m) => {
    const diff = differenceInDays(new Date(), new Date(m.date));
    return diff >= 0 && diff < 7;
  });
  if (last7.length === 0) return null;
  return (last7.reduce((sum, m) => sum + m.score, 0) / last7.length).toFixed(1);
}

export function getHeatmapData(entries, days = 84) {
  const today = new Date();
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(today, i), "yyyy-MM-dd");
    const entry = entries.find((e) => e.date === date);
    data.push({ date, value: entry ? entry.value || 1 : 0 });
  }
  return data;
}

export function generateInsights(moods, habits, journal) {
  const insights = [];
  const avg = getWeeklyAverage(moods);

  if (avg && avg >= 4) {
    insights.push({ type: "positive", text: "Your mood has been consistently positive this week. Keep up the great work!" });
  } else if (avg && avg <= 2.5) {
    insights.push({ type: "concern", text: "Your mood has been lower than usual. Consider reaching out to someone you trust." });
  }

  const streak = calculateStreak(moods);
  if (streak >= 7) {
    insights.push({ type: "achievement", text: `Amazing ${streak}-day check-in streak! Consistency builds resilience.` });
  }

  const completedHabits = habits.filter((h) => {
    const today = format(new Date(), "yyyy-MM-dd");
    return h.completions?.includes(today);
  });
  if (completedHabits.length === habits.length && habits.length > 0) {
    insights.push({ type: "positive", text: "You completed all your habits today! That's dedication." });
  }

  const recentJournals = journal.filter((j) => {
    const diff = differenceInDays(new Date(), new Date(j.date));
    return diff >= 0 && diff < 7;
  });
  if (recentJournals.length >= 5) {
    insights.push({ type: "positive", text: "Journaling regularly is helping you process your thoughts. Great habit!" });
  }

  if (insights.length === 0) {
    insights.push({ type: "neutral", text: "Start logging your mood and habits to receive personalized insights." });
  }

  return insights;
}

export const CBT_DISTORTIONS = [
  { id: "catastrophizing", label: "Catastrophizing", description: "Expecting the worst possible outcome", reframe: "What's the most realistic outcome? Has this worst case ever actually happened?" },
  { id: "all-or-nothing", label: "All-or-Nothing Thinking", description: "Seeing things in black and white", reframe: "Is there a middle ground? Can I find shades of gray in this situation?" },
  { id: "mind-reading", label: "Mind Reading", description: "Assuming you know what others think", reframe: "Do I have evidence for what they're thinking? Could there be another explanation?" },
  { id: "emotional-reasoning", label: "Emotional Reasoning", description: "Believing something is true because it feels that way", reframe: "Just because I feel it doesn't make it true. What are the facts?" },
  { id: "overgeneralization", label: "Overgeneralization", description: "Using one event as evidence for a broad conclusion", reframe: "Is this truly always the case? Can I think of times when this wasn't true?" },
  { id: "labeling", label: "Labeling", description: "Attaching a negative label to yourself or others", reframe: "Would I say this about a friend? One action doesn't define a person." },
  { id: "should-statements", label: "Should Statements", description: "Using 'should', 'must', or 'ought to'", reframe: "Who made this rule? What if I replace 'should' with 'I'd prefer to'?" },
  { id: "personalization", label: "Personalization", description: "Blaming yourself for things outside your control", reframe: "What factors were actually within my control? Am I taking too much responsibility?" },
];

export const AMBIENT_SOUNDS = [
  { id: "rain", label: "Rain", icon: "🌧️", frequency: 200 },
  { id: "forest", label: "Forest", icon: "🌲", frequency: 300 },
  { id: "ocean", label: "Ocean Waves", icon: "🌊", frequency: 150 },
  { id: "fire", label: "Fireplace", icon: "🔥", frequency: 250 },
  { id: "wind", label: "Wind", icon: "💨", frequency: 180 },
  { id: "birds", label: "Birds", icon: "🐦", frequency: 350 },
];
