import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PCManagement } from "./admin/PCManagement";
import { LogisticsManagement } from "./admin/LogisticsManagement";
import { LoanManagement } from "./admin/LoanManagement";
export function AdminWorkspace() {
    return (<div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2">Admin Workspace</h1>
        <p className="text-muted-foreground">Manage lab inventory, logistics, and loans</p>
      </div>

      <Tabs defaultValue="pcs" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pcs">PC Management</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="pcs">
          <PCManagement />
        </TabsContent>

        <TabsContent value="logistics">
          <LogisticsManagement />
        </TabsContent>

        <TabsContent value="loans">
          <LoanManagement />
        </TabsContent>
      </Tabs>
    </div>);
}
