import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        // A
        accordion: resolve(__dirname, "accordion.html"),

        // B
        badge: resolve(__dirname, "badge.html"),
        baseStyles: resolve(__dirname, "baseStyles.html"),
        buttons: resolve(__dirname, "buttons.html"),

        // C
        checkBox: resolve(__dirname, "checkBox.html"),
        combobox: resolve(__dirname, "combobox.html"),
        customProgress: resolve(__dirname, "customProgress.html"),

        // D
        dialog: resolve(__dirname, "dialog.html"),

        // E
        errorsNotifications: resolve(__dirname, "errorsNotifications.html"),

        // F
        fileInput: resolve(__dirname, "fileInput.html"),
        footer: resolve(__dirname, "footer.html"),
        form: resolve(__dirname, "form.html"),

        // H
        header: resolve(__dirname, "header.html"),
        hyperlink: resolve(__dirname, "hyperlink.html"),

        // I
        imageContainer: resolve(__dirname, "imageContainer.html"),
        imageInput: resolve(__dirname, "imageInput.html"),
        input: resolve(__dirname, "input.html"),

        //J
         javascript: resolve(__dirname, "javascript.html"),
         
        // L
        langMenu: resolve(__dirname, "langMenu.html"),
        layoutBasics: resolve(__dirname, "layouts-basics.html"),
        lists: resolve(__dirname, "lists.html"),
        loader: resolve(__dirname, "loader.html"),

        // M
        main: resolve(__dirname, "index.html"),
        modal: resolve(__dirname, "modal.html"),
        multiForm: resolve(__dirname, "multiForms.html"),

        // P
        pagination: resolve(__dirname, "pagination.html"),
        progress: resolve(__dirname, "progress.html"),

        // R
        radioInput: resolve(__dirname, "radio-input.html"),
        rtl: resolve(__dirname, "rtl.html"),

        // S
        section: resolve(__dirname, "section.html"),
        selector: resolve(__dirname, "selector.html"),
        sidebar: resolve(__dirname, "sidebar.html"),

        // T
        table: resolve(__dirname, "table.html"),
        tabs: resolve(__dirname, "tabs.html"),
        textArea: resolve(__dirname, "textarea.html"),
        toast: resolve(__dirname, "toast.html"),
        tooltip: resolve(__dirname, "tooltip.html"),

        //U
         utilities: resolve(__dirname, "utilities.html"),
      },
    },
  },
});
