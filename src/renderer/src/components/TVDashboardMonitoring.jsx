import { useState, useEffect } from "react";
import { Monitor, Activity, Clock } from "lucide-react";
const generatePCData = () => {
    const labs = ["E4", "L4", "L3"];
    const pcs = [];
    labs.forEach((lab) => {
        const count = lab === "E4" ? 80 : lab === "L4" ? 80 : 65;
        for (let i = 1; i <= count; i++) {
            const random = Math.random();
            let status;
            if (random < 0.85)
                status = "active";
            else if (random < 0.93)
                status = "maintenance";
            else
                status = "broken";
            pcs.push({
                code: `${lab}-PC-${String(i).padStart(3, "0")}`,
                lab,
                status,
            });
        }
    });
    return pcs;
};
const initialActivities = [
    { time: "10:30:15", action: "Maintenance completed", pc: "E4-PC-042", status: "success" },
    { time: "10:25:42", action: "PC marked as broken", pc: "L4-PC-015", status: "error" },
    { time: "10:18:33", action: "Maintenance started", pc: "L3-PC-028", status: "warning" },
    { time: "10:12:07", action: "PC back to active", pc: "E4-PC-067", status: "success" },
];
export function TVDashboardMonitoring({ userRole = "SuperAdmin", userLab = null }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [allPCs] = useState(generatePCData());
    const [activities, setActivities] = useState(initialActivities);
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    // Filter PCs based on user role and lab
    const pcs = userRole === "AdminLab" && userLab
        ? allPCs.filter((pc) => pc.lab === userLab)
        : allPCs;
    // Group PCs by lab (filtered based on user role)
    const labGroups = {};
    if (userRole === "AdminLab" && userLab) {
        // AdminLab only sees their own lab
        labGroups[userLab] = pcs;
    }
    else {
        // SuperAdmin sees all labs
        labGroups.E4 = pcs.filter((pc) => pc.lab === "E4");
        labGroups.L4 = pcs.filter((pc) => pc.lab === "L4");
        labGroups.L3 = pcs.filter((pc) => pc.lab === "L3");
    }
    const stats = {
        active: pcs.filter((pc) => pc.status === "active").length,
        broken: pcs.filter((pc) => pc.status === "broken").length,
        maintenance: pcs.filter((pc) => pc.status === "maintenance").length,
        total: pcs.length,
    };
    // Filter activities based on user lab
    const filteredActivities = userRole === "AdminLab" && userLab
        ? activities.filter((activity) => activity.pc.startsWith(userLab))
        : activities;
    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-500";
            case "broken":
                return "bg-red-500";
            case "maintenance":
                return "bg-orange-500";
            default:
                return "bg-gray-500";
        }
    };
    const getStatusGlow = (status) => {
        switch (status) {
            case "active":
                return "shadow-[0_0_6px_rgba(34,197,94,0.3)]";
            case "broken":
                return "shadow-[0_0_6px_rgba(239,68,68,0.3)]";
            case "maintenance":
                return "shadow-[0_0_6px_rgba(245,158,11,0.3)]";
            default:
                return "";
        }
    };
    return (<div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2F438F] to-[#5D7CEB] rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Monitor className="w-10 h-10 text-white"/>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Lkomp Hardware Overview
                {userRole === "AdminLab" && userLab && ` - Lab ${userLab}`}
              </h1>
              <p className="text-white/90 text-lg">Real-Time Monitoring Dashboard</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-white"/>
              <span className="text-2xl font-bold text-white">
                {currentTime.toLocaleTimeString("id-ID")}
              </span>
            </div>
            <p className="text-white/90">
              {currentTime.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-blue-600"/>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total PC</p>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600"/>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Active</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-red-600"/>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Broken</p>
              <p className="text-3xl font-bold text-red-600">{stats.broken}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600"/>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Maintenance</p>
              <p className="text-3xl font-bold text-orange-600">{stats.maintenance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* PC Status Grid - 3 columns */}
        <div className="col-span-3 space-y-4">
          {Object.entries(labGroups).map(([lab, labPCs]) => (<div key={lab} className="bg-card rounded-xl p-6 border border-border shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  Lab {lab}
                </span>
                <span className="text-muted-foreground text-sm">
                  ({labPCs.length} units)
                </span>
              </h2>
              <div className="grid grid-cols-10 gap-2">
                {labPCs.map((pc) => (<div key={pc.code} className={`aspect-square rounded-lg ${getStatusColor(pc.status)} ${getStatusGlow(pc.status)} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-sm`} title={`${pc.code} - ${pc.status}`}>
                    <span className="text-xs font-semibold text-white">
                      {pc.code.split("-")[2]}
                    </span>
                  </div>))}
              </div>
            </div>))}
        </div>

        {/* Activity Feed - 1 column */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Activity className="w-5 h-5"/>
            Live Activity Feed
          </h2>
          <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
            {filteredActivities.map((activity, index) => (<div key={index} className="bg-background rounded-lg p-3 border border-border hover:border-[#5D7CEB] transition-colors">
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${activity.status === "success"
                ? "bg-green-500"
                : activity.status === "warning"
                    ? "bg-orange-500"
                    : "bg-red-500"}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.pc}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-card rounded-xl p-4 border border-border shadow-md">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${getStatusColor("active")} shadow-sm`}></div>
            <span className="text-sm text-foreground font-medium">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${getStatusColor("broken")} shadow-sm`}></div>
            <span className="text-sm text-foreground font-medium">Broken</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${getStatusColor("maintenance")} shadow-sm`}></div>
            <span className="text-sm text-foreground font-medium">Maintenance</span>
          </div>
        </div>
      </div>
    </div>);
}
