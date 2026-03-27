<script lang="ts">
    import ChartBarIcon from "@tabler/icons-svelte/icons/chart-bar";
    import DatabaseIcon from "@tabler/icons-svelte/icons/database";
    import FileWordIcon from "@tabler/icons-svelte/icons/file-word";
    import HelpIcon from "@tabler/icons-svelte/icons/help";
    import ShoppingBag from "@tabler/icons-svelte/icons/shopping-bag";
    import ReportIcon from "@tabler/icons-svelte/icons/report";
    import SearchIcon from "@tabler/icons-svelte/icons/search";
    import SettingsIcon from "@tabler/icons-svelte/icons/settings";
    import UsersIcon from "@tabler/icons-svelte/icons/users";
    import PredictionIcon from "@tabler/icons-svelte/icons/artboard";
    import RevnueIcon from "@tabler/icons-svelte/icons/database-dollar";
    import DashboardIcon from "@tabler/icons-svelte/icons/layout-dashboard";
    import NavDocuments from "./nav-documents.svelte";
    import NavMain from "./nav-main.svelte";
    import NavSecondary from "./nav-secondary.svelte";
    import NavUser from "./nav-user.svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import type { ComponentProps } from "svelte";
    import { useSidebar } from "$lib/components/ui/sidebar/index.js";
    import { page } from "$app/state";
    import { resolve } from "$app/paths";

    const data = {
        user: page.data.user,
        navMain: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: DashboardIcon,
            },
            {
                title: "Predication",
                url: "#",
                icon: PredictionIcon,
            },
            {
                title: "Production",
                url: "#",
                icon: ChartBarIcon,
            },
            {
                title: "Revnue",
                url: "#",
                icon: RevnueIcon,
            },
            {
                title: "Team",
                url: "#",
                icon: UsersIcon,
            },
        ],
        navSecondary: [
            {
                title: "Settings",
                url: "#",
                icon: SettingsIcon,
            },
            {
                title: "Get Help",
                url: "#",
                icon: HelpIcon,
            },
            {
                title: "Search",
                url: "#",
                icon: SearchIcon,
            },
        ],
        documents: [
            {
                name: "Data Library",
                url: "#",
                icon: DatabaseIcon,
            },
            {
                name: "Reports",
                url: "#",
                icon: ReportIcon,
            },
            {
                name: "Word Assistant",
                url: "#",
                icon: FileWordIcon,
            },
        ],
    };

    let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
    const sidebar = useSidebar();
</script>

<Sidebar.Root collapsible="icon" {...restProps}>
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <Sidebar.MenuButton
                    size="lg"
                    class="data-[slot=sidebar-menu-button]:p-1.5!"
                >
                    {#snippet child({ props })}
                        <a href={resolve("/dashboard")} {...props}>
                            <ShoppingBag
                                class={sidebar.open ? "size-10!" : "size-5!"}
                            />
                            <span class="flex flex-col items-start">
                                <span class="text-base font-semibold"
                                    >LMRS Shop</span
                                >
                                <span class="text-base"
                                    >Intelligence System</span
                                >
                            </span>
                        </a>
                    {/snippet}
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} class="mt-auto" />
    </Sidebar.Content>
    <Sidebar.Footer>
        <NavUser user={data.user} />
    </Sidebar.Footer>
</Sidebar.Root>
