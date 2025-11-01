import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WelcomePage() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Cinetra</h1>
          <p className="text-xl text-muted-foreground">
            Your personal entertainment tracking companion
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What is Cinetra?</CardTitle>
            <CardDescription>
              Cinetra helps you organize and track all your favorite movies and TV shows in one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Never lose track of what you're watching or what you want to watch next. 
              With Cinetra, you can easily manage your watchlist, keep track of episodes, 
              and discover new content to enjoy.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📺</span>
                TV Shows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Track your favorite TV series</li>
                <li>• Monitor episode progress</li>
                <li>• Manage your watchlist</li>
                <li>• Never miss an episode</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎬</span>
                Movies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Keep a list of movies to watch</li>
                <li>• Track what you've watched</li>
                <li>• Organize by genre or mood</li>
                <li>• Build your personal library</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Use the sidebar to navigate to <strong>Shows</strong> or <strong>Movies</strong> to start 
              building your collection. Add new titles, track your progress, and enjoy your entertainment journey!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
