"use client";

import { useState } from "react";
import { Info, Check, Loader2, Sparkles, HeartHandshake, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function EnlistNgoPage() {
  const [formData, setFormData] = useState({
    ngoName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    areaHint: "",
    description: "",
    services: {
      rescue: false,
      medical: false,
      feeding: false,
      vaccination: false,
      sterilization: false,
      shelter: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (serviceKey: keyof typeof formData.services) => {
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceKey]: !prev.services[serviceKey],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    // Client-side validations
    if (!formData.ngoName || !formData.email || !formData.phone || !formData.address) {
      setStatus({
        type: "error",
        message: "Please fill in all the required fields (NGO Name, Email, Phone, and Address).",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/enlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: data.message || "Thank you! Your enlistment request has been received.",
        });
        // Reset form
        setFormData({
          ngoName: "",
          contactPerson: "",
          email: "",
          phone: "",
          address: "",
          areaHint: "",
          description: "",
          services: {
            rescue: false,
            medical: false,
            feeding: false,
            vaccination: false,
            sterilization: false,
            shelter: false,
          },
        });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to submit request. Please try again later.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "A network error occurred. Please check your internet connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      {/* Header section */}
      <div className="mb-10 text-center md:text-left space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          <span>Expand Our Rescue Network</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Enlist Your Animal NGO
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-3xl">
          Join Hope&apos;s directory of animal welfare organizations in Kolkata. Help community members find your organization when stray animals in your area need immediate rescue or medical support.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Educational Content & Who Can Enlist */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Info className="size-4 text-primary" />
                Why Join the Hope Network?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                Hope connects local citizens with nearby rescue teams. By registering, you make your organization visible to users in your immediate locality.
              </p>
              <p className="font-semibold text-foreground/90">
                Support for all rescue initiatives:
              </p>
              <p className="text-xs">
                Whether your organization helps dogs, cats, large animals, birds, or wildlife, you are welcome here. If you provide any form of immediate care, first-aid, sterilization, or shelter, enlisting helps citizens connect with you in critical moments.
              </p>
            </CardContent>
          </Card>

          {/* Who Can Enlist */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">
              Who Can Enlist?
            </h3>

            <div className="grid gap-3 lg:grid-cols-1">
              <div className="flex items-start gap-4 rounded-xl border border-dashed border-border bg-card p-4 transition-all hover:bg-muted/30">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <HeartHandshake className="size-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Any Animal Rescue or Shelter</h4>
                  <p className="text-xs text-muted-foreground">
                    We welcome all organizations—regardless of whether you help dogs, cats, cows, goats, birds, or other animals. If you assist local street animals, you belong in our network.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-dashed border-border bg-card p-4 transition-all hover:bg-muted/30">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                  <Activity className="size-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Immediate Medical & Care Providers</h4>
                  <p className="text-xs text-muted-foreground">
                    If your team provides immediate medical attention, field first-aid, sterilization (ABC) drives, feeding runs, or emergency transport, enlisting makes you visible to caretakers in need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Submit Enlistment Details</CardTitle>
              <CardDescription>
                Provide details about your NGO. Once verified, we will add your details to the map and contact lists.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status.type && (
                <div
                  className={`mb-6 rounded-lg p-4 text-sm flex items-start gap-2.5 ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                      : "bg-destructive/10 text-destructive border border-destructive/20 dark:bg-destructive/20 dark:text-red-400 dark:border-red-950/30"
                  }`}
                >
                  {status.type === "success" ? (
                    <Check className="size-4 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="size-4 shrink-0 mt-0.5" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="ngoName" className="text-sm font-medium text-foreground">
                      NGO Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="ngoName"
                      name="ngoName"
                      required
                      placeholder="e.g. Kolkata Animal Welfare Trust"
                      value={formData.ngoName}
                      onChange={handleTextChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contactPerson" className="text-sm font-medium text-foreground">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      placeholder="e.g. Dr. A. Sen"
                      value={formData.contactPerson}
                      onChange={handleTextChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Public Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="e.g. contact@kawt.org"
                      value={formData.email}
                      onChange={handleTextChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone / Helpline <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="e.g. +91 98300 XXXXX"
                      value={formData.phone}
                      onChange={handleTextChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="address" className="text-sm font-medium text-foreground">
                      Full Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      placeholder="e.g. 12/A, Elgin Road, Kolkata - 700020"
                      value={formData.address}
                      onChange={handleTextChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="areaHint" className="text-sm font-medium text-foreground">
                      Area Coverage / Hint
                    </label>
                    <input
                      type="text"
                      id="areaHint"
                      name="areaHint"
                      placeholder="e.g. South Kolkata, Howrah"
                      value={formData.areaHint}
                      onChange={handleTextChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Services Offered</label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {Object.keys(formData.services).map((key) => {
                      const serviceKey = key as keyof typeof formData.services;
                      const label = serviceKey.charAt(0).toUpperCase() + serviceKey.slice(1);
                      return (
                        <label
                          key={serviceKey}
                          className="flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer hover:bg-muted/40 transition-colors select-none"
                        >
                          <input
                            type="checkbox"
                            checked={formData.services[serviceKey]}
                            onChange={() => handleCheckboxChange(serviceKey)}
                            className="rounded border-input text-primary focus:ring-ring"
                          />
                          <span>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="text-sm font-medium text-foreground">
                    Brief Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Tell us about your organization's capacity, facilities (ambulance, clinic), etc."
                    value={formData.description}
                    onChange={handleTextChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    "Submit Enlistment"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
