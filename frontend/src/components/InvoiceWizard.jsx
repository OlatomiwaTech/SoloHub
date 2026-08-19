import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";

// Mock data
const mockClients = [
  { id: "1", name: "CodeCraft Studios", email: "hello@codecraft.com" },
  { id: "2", name: "DesignHub Agency", email: "info@designhub.com" },
  { id: "3", name: "GreenByte Technologies", email: "contact@greenbyte.com" },
  { id: "4", name: "Brandify Co.", email: "studio@brandify.com" },
];

const mockProjects = [
  { id: "1", name: "E-commerce Website", clientId: "1" },
  { id: "2", name: "Mobile App Design", clientId: "2" },
  { id: "3", name: "Dashboard Redesign", clientId: "2" },
  { id: "4", name: "API Integration", clientId: "3" },
  { id: "5", name: "Brand Identity", clientId: "4" },
  { id: "6", name: "Website Redesign", clientId: "1" },
];

const invoiceSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  projectId: z.string().min(1, "Please select a project"),
  amount: z.string().min(1, "Please enter an amount"),
  description: z.string().min(3, "Please enter a description"),
  dueDate: z.string().min(1, "Please select a due date"),
});

const InvoiceWizard = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
      projectId: "",
      amount: "",
      description: "",
      dueDate: "",
    },
  });

  const clientId = watch("clientId");
  const projectId = watch("projectId");

  const filteredProjects = mockProjects.filter(
    (project) => project.clientId === clientId
  );

  const selectedClient = mockClients.find((c) => c.id === clientId);
  const selectedProject = mockProjects.find((p) => p.id === projectId);

  const handleNext = () => {
    if (step === 1 && !clientId) {
      toast.error("Please select a client");
      return;
    }
    if (step === 2 && !projectId) {
      toast.error("Please select a project");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleClose = () => {
    reset();
    setStep(1);
    setGeneratedInvoice(null);
    onClose();
  };

  const onSubmit = (data) => {
    setIsGenerating(true);
    setTimeout(() => {
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const newInvoice = {
        id: invoiceNumber,
        number: invoiceNumber,
        client: selectedClient,
        project: selectedProject,
        amount: parseFloat(data.amount),
        description: data.description,
        dueDate: data.dueDate,
        issueDate: new Date().toISOString(),
        status: "DRAFT",
      };
      setGeneratedInvoice(newInvoice);
      setIsGenerating(false);
      toast.success("Invoice generated successfully!");
      setStep(4);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white">
          <DialogTitle className="text-xl font-bold text-slate-900 bg-white">
            Create New Invoice
          </DialogTitle>
          <DialogDescription className="bg-white">
            Create a professional invoice in minutes
          </DialogDescription>
        </DialogHeader>

        {/* Stepper Progress */}
        {step !== 4 && (
          <div className="flex items-center gap-2 py-4 bg-white">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 bg-white">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s === step
                      ? "bg-emerald-600 text-white"
                      : s < step
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {s < step ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      s < step ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        <div className="py-4 bg-white">
          {step === 1 && (
            <div className="space-y-6 bg-white">
              <div className="bg-white">
                <h3 className="text-lg font-semibold text-slate-900 bg-white">
                  Select a Client
                </h3>
                <p className="text-sm text-slate-500 bg-white">
                  Choose the client you're invoicing
                </p>
              </div>

              <div className="space-y-3 bg-white">
                <Label className="text-sm font-medium text-slate-700 bg-white">
                  Select Client
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                  {mockClients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => {
                        setValue("clientId", client.id);
                        setValue("projectId", "");
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 bg-white ${
                        clientId === client.id
                          ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                          : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md hover:shadow-slate-100"
                      }`}
                    >
                      <p className="font-semibold text-sm text-slate-900">
                        {client.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {client.email}
                      </p>
                      {clientId === client.id && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3" /> Selected
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {errors.clientId && (
                  <p className="text-sm text-red-500">{errors.clientId.message}</p>
                )}
              </div>

              <div className="flex justify-end bg-white">
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={!clientId}
                >
                  Next Step
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 bg-white">
              <div className="bg-white">
                <h3 className="text-lg font-semibold text-slate-900 bg-white">
                  Select a Project
                </h3>
                <p className="text-sm text-slate-500 bg-white">
                  Choose the project you're billing for
                </p>
              </div>

              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600">
                  Client:{" "}
                  <span className="font-semibold text-slate-900">
                    {selectedClient?.name}
                  </span>
                </p>
              </div>

              <div className="space-y-3 bg-white">
                <Label className="text-sm font-medium text-slate-700 bg-white">
                  Select Project
                </Label>
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                    {filteredProjects.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => setValue("projectId", project.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 bg-white ${
                          projectId === project.id
                            ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                            : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md hover:shadow-slate-100"
                        }`}
                      >
                        <p className="font-semibold text-sm text-slate-900">
                          {project.name}
                        </p>
                        {projectId === project.id && (
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <Check className="h-3 w-3" /> Selected
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                    <p className="text-sm text-slate-500">
                      No projects found for this client
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Create a project first
                    </p>
                  </div>
                )}
                {errors.projectId && (
                  <p className="text-sm text-red-500">{errors.projectId.message}</p>
                )}
              </div>

              <div className="flex justify-between bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={!projectId}
                >
                  Next Step
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white">
              <div className="bg-white">
                <h3 className="text-lg font-semibold text-slate-900 bg-white">
                  Invoice Details
                </h3>
                <p className="text-sm text-slate-500 bg-white">
                  Enter the invoice information
                </p>
              </div>

              <div className="space-y-4 bg-white">
                <div className="space-y-2 bg-white">
                  <Label htmlFor="description" className="text-slate-700 bg-white">
                    Description of Work
                  </Label>
                  <Input
                    id="description"
                    placeholder="e.g., Web Design - 20 hours"
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2 bg-white">
                  <Label htmlFor="amount" className="text-slate-700 bg-white">
                    Amount (₦)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="250000"
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    {...register("amount")}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount.message}</p>
                  )}
                </div>

                <div className="space-y-2 bg-white">
                  <Label htmlFor="dueDate" className="text-slate-700 bg-white">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    {...register("dueDate")}
                  />
                  {errors.dueDate && (
                    <p className="text-sm text-red-500">{errors.dueDate.message}</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  📋 Invoice Summary
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Client</span>
                    <span className="font-semibold text-slate-900">
                      {selectedClient?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Project</span>
                    <span className="font-semibold text-slate-900">
                      {selectedProject?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-500">Status</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      Draft
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Invoice
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-8 space-y-4 bg-white">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 bg-white">
                Invoice Generated! 🎉
              </h3>
              <p className="text-slate-500 bg-white">
                Your invoice has been created successfully.
              </p>

              {generatedInvoice && (
                <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-left max-w-sm mx-auto">
                  <p className="text-sm font-medium text-slate-700">
                    Invoice #{generatedInvoice.number}
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Client:</span>
                      <span className="font-medium text-slate-900">
                        {generatedInvoice.client?.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Project:</span>
                      <span className="font-medium text-slate-900">
                        {generatedInvoice.project?.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Amount:</span>
                      <span className="font-bold text-emerald-600">
                        ₦{generatedInvoice.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Due Date:</span>
                      <span className="font-medium text-slate-900">
                        {format(new Date(generatedInvoice.dueDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center bg-white">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => toast.info("Coming soon: Send invoice to client!")}
                >
                  Send to Client
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceWizard;