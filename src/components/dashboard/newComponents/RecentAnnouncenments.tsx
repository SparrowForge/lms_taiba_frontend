import { Button, Card } from "antd";

const data = [
  {
    color: "#eff6ff",
    title: "Faculty Meeting",
    date: "2025-08-24", // today
    text: "All faculty members are required to attend the meeting at 4:00 PM in the conference room."
  },
  {
    color: "#fffbeb",
    title: "Exam Schedule",
    date: "2025-08-23", // yesterday
    text: "Mid-term examination schedule has been updated. Please check your dashboard."
  },
  {
    color: "#ede9fe",
    title: "Orientation",
    date: "2025-08-24",
    text: "New student orientation details updated in the portal."
  },
  {
    color: "#d1fae5",
    title: "Workshop",
    date: "2025-08-23", // today
    text: "All faculty members are required to attend the workshop at 2:00 PM in the auditorium."
  },
];

const formatDay = (dateString: string) => {
  const today = new Date();
  const given = new Date(dateString);

  const todayStr = today.toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (dateString === todayStr) return "Today";
  if (dateString === yesterdayStr) return "Yesterday";
  return given.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const sortData = (items: typeof data) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  return [...items].sort((a, b) => {
    // Priority 1: Today first
    if (a.date === todayStr && b.date !== todayStr) return -1;
    if (b.date === todayStr && a.date !== todayStr) return 1;

    // Priority 2: Yesterday next
    if (a.date === yesterdayStr && b.date !== yesterdayStr) return -1;
    if (b.date === yesterdayStr && a.date !== yesterdayStr) return 1;

    // Priority 3: Newer dates first
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

const RecentAnnouncenments = () => {
  const sortedData = sortData(data);

  return (
    <div className="mb-5">
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[16px] font-semibold">
            Recent Announcements | اإلعالنات األخيرة
          </h1>
          <Button
            type="text"
            style={{ color: "#1F4BCA", fontSize: "16px" }}
          >
            View All
          </Button>
        </div>

        {/* Announcements list */}
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
          {sortedData.map((item, index) => (
            <div
              key={index}
              className="py-2 px-4 rounded-lg"
              style={{ background: item.color }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-[16px] font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-600">{formatDay(item.date)}</p>
              </div>
              <p className="text-[13px] text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RecentAnnouncenments;
