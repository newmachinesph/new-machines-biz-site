import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Dialog, Input, Select, STATUS_LABEL, Table, Tabs } from "@/design-system/components";

export function Demos() {
  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="demo-button">
        <h3 id="demo-button" className="mb-3 text-sm font-semibold">Button</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button><Button>Primary</Button><Button size="lg">Large</Button>
          <Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button>
          <Button loading>Loading</Button><Button disabled>Disabled</Button>
        </div>
      </section>
      <section aria-labelledby="demo-badge">
        <h3 id="demo-badge" className="mb-3 text-sm font-semibold">Badge</h3>
        <div className="flex flex-wrap gap-3">
          <Badge>Demo</Badge>
          {(Object.keys(STATUS_LABEL) as (keyof typeof STATUS_LABEL)[]).map((s) => <Badge key={s} status={s} />)}
        </div>
      </section>
      <section aria-labelledby="demo-fields" className="grid max-w-prose gap-4 sm:grid-cols-2">
        <h3 id="demo-fields" className="col-span-full text-sm font-semibold">Input · Select</h3>
        <Input label="Organization name" placeholder="Sumnora" hint="Shown on invoices" />
        <Input label="Budget cap" defaultValue="abc" error="Must be a number" />
        <Select label="Region" placeholder="Choose a region" options={[{ value: "jp", label: "Japan" }, { value: "sg", label: "Singapore" }, { value: "au", label: "Australia" }, { value: "kr", label: "Korea" }]} />
      </section>
      <section aria-labelledby="demo-card">
        <h3 id="demo-card" className="mb-3 text-sm font-semibold">Card</h3>
        <Card className="max-w-sm"><CardHeader><CardTitle>Workflow Pack</CardTitle></CardHeader><CardBody>Pre-configured agents, decisions, connectors and reviews for one business outcome.</CardBody></Card>
      </section>
      <section aria-labelledby="demo-table">
        <h3 id="demo-table" className="mb-3 text-sm font-semibold">Table</h3>
        <Table
          caption="Recent runs (demo data)"
          columns={[{ key: "id", header: "Run", mono: true }, { key: "status", header: "Status" }, { key: "cost", header: "Cost", align: "right" }]}
          rows={[
            { id: "run_01HX…", status: <Badge status="verified" />, cost: "¥180" },
            { id: "run_01HY…", status: <Badge status="waiting-for-human" />, cost: "¥95" },
            { id: "run_01HZ…", status: <Badge status="blocked" />, cost: "¥0" },
          ]}
        />
      </section>
      <section aria-labelledby="demo-tabs">
        <h3 id="demo-tabs" className="mb-3 text-sm font-semibold">Tabs</h3>
        <Tabs items={[{ value: "a", label: "Agents", content: <p className="text-sm">Agents panel</p> }, { value: "p", label: "Packs", content: <p className="text-sm">Packs panel</p> }]} />
      </section>
      <section aria-labelledby="demo-dialog">
        <h3 id="demo-dialog" className="mb-3 text-sm font-semibold">Dialog</h3>
        <Dialog trigger={<Button variant="secondary">Open dialog</Button>} title="Approve permissions" description="This pack requests read-only access to one Google Sheet.">
          <ul className="list-disc pl-5"><li>sheets.read</li></ul>
        </Dialog>
      </section>
    </div>
  );
}
