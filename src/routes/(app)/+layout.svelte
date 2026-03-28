<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/app-sidebar.svelte";
    import SiteHeader from "$lib/components/site-header.svelte";

    let { children } = $props();
</script>

<Sidebar.Provider
    style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
    <AppSidebar variant="inset" collapsible="icon" />
    <Sidebar.Inset>
        <SiteHeader />
        <div class="flex flex-1 flex-col">
            <div class="@container/main flex flex-1 flex-col gap-2">
                <!-- <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-3"> -->
                <div class="flex flex-col py-4 md:py-1">
                    {@render children()}
                </div>
            </div>
        </div>
    </Sidebar.Inset>
</Sidebar.Provider>
