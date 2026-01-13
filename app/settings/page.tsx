"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Moon, Sun, Monitor } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your preferences and account settings</p>
        </div>

        <Tabs defaultValue="theme" className="space-y-6">
          <TabsList>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Choose how you want the app to look</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base">Color Theme</Label>
                  <RadioGroup value={theme || "system"} onValueChange={setTheme}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition cursor-pointer">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer flex-1 m-0">
                        <Sun className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Light</div>
                          <div className="text-sm text-muted-foreground">Use light theme during the day</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition cursor-pointer">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer flex-1 m-0">
                        <Moon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Dark</div>
                          <div className="text-sm text-muted-foreground">Use dark theme for reduced eye strain</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition cursor-pointer">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer flex-1 m-0">
                        <Monitor className="h-4 w-4" />
                        <div>
                          <div className="font-medium">System</div>
                          <div className="text-sm text-muted-foreground">Match your device settings</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>General Preferences</CardTitle>
                <CardDescription>Manage your app preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Additional preference settings can be added here. Your theme selection is automatically saved.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
