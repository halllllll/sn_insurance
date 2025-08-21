package app

import (
	"os"
	"sn-insurance/config"
	"sn-insurance/frontend"
	"sn-insurance/internal/commands"
	"sn-insurance/internal/handlers"
	"strings"

	_ "sn-insurance/migrations" // import migrations to register them

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

// App represents the application instance
type App struct {
	pb  *pocketbase.PocketBase
	cfg *config.GlobalConfig
}

// New creates a new application instance
func New() *App {
	cfg := config.LoadConfig()

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	pb := pocketbase.NewWithConfig(pocketbase.Config{})

	// Register migrations
	migratecmd.MustRegister(pb, pb.RootCmd, migratecmd.Config{
		Automigrate:  isGoRun,
		TemplateLang: "go",
	})

	app := &App{
		pb:  pb,
		cfg: cfg,
	}

	app.setupHooks()
	app.setupCommands()
	app.setupRoutes()

	return app
}

// Start starts the application
func (a *App) Start() error {
	return a.pb.Start()
}

// setupHooks configures application hooks
func (a *App) setupHooks() {
	a.pb.OnBootstrap().BindFunc(func(e *core.BootstrapEvent) error {
		a.pb.Logger().Info("🐰 アプリケーションのブートストラップ中...")
		settings := a.pb.Settings()
		if settings.Meta.AppName == "Acme" {
			settings.Meta.AppName = a.cfg.AppInfo.Name
		}
		settings.Logs.MaxDays = 7
		settings.Logs.LogAuthId = true
		settings.Logs.LogIP = true
		return e.Next()
	})

	a.pb.OnRecordAuthWithOAuth2Request().BindFunc(func(e *core.RecordAuthWithOAuth2RequestEvent) error {
		// TODO: auth request時の処理
		return e.Next()
	})
}

// setupCommands registers custom commands
func (a *App) setupCommands() {
	commands.RegisterBulkInsertCommand(a.pb)
}

// setupRoutes configures application routes
func (a *App) setupRoutes() {
	a.pb.OnServe().BindFunc(func(e *core.ServeEvent) error {
		handlers.RegisterAPIRoutes(e)
		return e.Next()
	})

	a.pb.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.BindFunc(func(e *core.RequestEvent) error {
			// なにがしかのミドルウェア
			return e.Next()
		})

		// 埋め込まれたフロントエンドの静的ファイルを提供
		se.Router.GET("/{path...}", apis.Static(frontend.DistDirFS, true)).Bind(apis.Gzip())
		return se.Next()
	})
}
