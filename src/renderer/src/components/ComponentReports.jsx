import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "./ui/table";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, Package, Cpu } from "lucide-react";
const softwareData = [
    { software: "AutoCAD", count: 15 },
    { software: "MATLAB", count: 12 },
    { software: "VS Code", count: 25 },
    { software: "SolidWorks", count: 8 },
    { software: "Python", count: 20 },
];
const brandData = [
    { brand: "Intel", count: 18, color: "#0071c5" },
    { brand: "AMD", count: 7, color: "#ed1c24" },
    { brand: "NVIDIA", count: 12, color: "#76b900" },
    { brand: "Corsair", count: 15, color: "#ffc107" },
];
const lifespanData = [
    { component: "PC-A1", type: "Processor", age: 3.3, status: "Good" },
    { component: "PC-A2", type: "Processor", age: 2.9, status: "Good" },
    { component: "PC-B1", type: "Processor", age: 4.1, status: "Replace Soon" },
    { component: "PC-B4", type: "GPU", age: 5.2, status: "Critical" },
    { component: "PC-A5", type: "RAM", age: 2.1, status: "Good" },
];
export function ComponentReports() {
    const getLifespanBadge = (status) => {
        const variants = {
            Good: "bg-success text-success-foreground",
            "Replace Soon": "bg-warning text-warning-foreground",
            Critical: "bg-destructive text-destructive-foreground",
        };
        return variants[status] || "bg-muted";
    };
    return (<div className="p-6 space-y-6">
      <div>
        <h1 className="mb-2">Component Reports & Analytics</h1>
        <p className="text-muted-foreground">Track software distribution, hardware brands, and component lifespan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Software</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary"/>
              <span className="text-2xl">18</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Hardware Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary"/>
              <span className="text-2xl">12</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Components Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary"/>
              <span className="text-2xl">52</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="software" className="w-full">
        <TabsList>
          <TabsTrigger value="software">HD Report - Software</TabsTrigger>
          <TabsTrigger value="hardware">DT Report - Hardware Brands</TabsTrigger>
          <TabsTrigger value="lifespan">Lifespan Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="software" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>High Definition (HD) Report - Software Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">
                PCs categorized by installed software
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={softwareData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="software"/>
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#5b7fe6" name="PC Count"/>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Software</TableHead>
                      <TableHead>PC Count</TableHead>
                      <TableHead>Labs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>AutoCAD</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell>Lab A, Lab B</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>MATLAB</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>Lab A</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>VS Code</TableCell>
                      <TableCell>25</TableCell>
                      <TableCell>Lab A, Lab B, Lab C</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hardware" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed (DT) Report - Hardware by Brand</CardTitle>
              <p className="text-sm text-muted-foreground">
                Component stock categorized by manufacturer
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={brandData} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.brand}: ${entry.count}`} outerRadius={100} fill="#8884d8" dataKey="count">
                      {brandData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color}/>))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Brand</TableHead>
                        <TableHead>Component Count</TableHead>
                        <TableHead>Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Intel</TableCell>
                        <TableCell>18</TableCell>
                        <TableCell>Processor</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>AMD</TableCell>
                        <TableCell>7</TableCell>
                        <TableCell>Processor, GPU</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>NVIDIA</TableCell>
                        <TableCell>12</TableCell>
                        <TableCell>GPU</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Corsair</TableCell>
                        <TableCell>15</TableCell>
                        <TableCell>RAM, Storage</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifespan" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Component Lifespan Tracking</CardTitle>
              <p className="text-sm text-muted-foreground">
                Automatic calculation based on purchase date for asset renewal planning
              </p>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Age (Years)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recommendation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lifespanData.map((item, index) => (<TableRow key={index}>
                        <TableCell>{item.component}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.age.toFixed(1)}</TableCell>
                        <TableCell>
                          <Badge className={getLifespanBadge(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.status === "Critical"
                ? "Replace immediately"
                : item.status === "Replace Soon"
                    ? "Plan replacement in 6 months"
                    : "Monitor regularly"}
                        </TableCell>
                      </TableRow>))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);
}
