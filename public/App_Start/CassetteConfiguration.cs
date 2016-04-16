using Cassette;
using Cassette.Scripts;
using Cassette.Stylesheets;
using System.Collections.Generic;
using Cassette.HtmlTemplates;
using Base.Common;

namespace PROTON
{
    /// <summary>
    /// Configures the Cassette asset bundles for the web application.
    /// Reference:http://getcassette.net/documentation/v2/
    /// </summary>
    public class CassetteBundleConfiguration : IConfiguration<BundleCollection>
    {
        public void Configure(BundleCollection bundles)
        {
            // Add a stylesheet bundle containing all the CSS
            AddStylesheetBundles(bundles);
            // Add a script bundle containing containing only common js files
            AddScriptBundles(bundles);
            //Templates bundling
            AddTemplateBundles(bundles);
        }

        /// <summary>
        /// Stylesheet Bundling
        /// </summary>
        private static void AddStylesheetBundles(BundleCollection bundles)
        {
            bundles.Add<StylesheetBundle>("~/Content");
            //bundling for all common css files start
            List<string> CommonCss = new List<string>();
            //using centroid to read data from json
            var bundleCommonCssfiles = CommonUtils.Centroid.bowerComponentCss;
            foreach (var file in bundleCommonCssfiles)
            {
                CommonCss.Add("~/" + file.Replace("\n", "").Trim());
            }
            var CommonCssRelativePath = CommonUtils.Centroid.BowerComponentStylesRelativePath[0];
            bundles.Add<StylesheetBundle>((string)CommonCssRelativePath,
                                     CommonCss,
                                     bundle => bundle.PageLocation = "CommonCss");

            ////bundling for all common css files end
        }

        /// <summary>
        /// Scripts Bundling
        /// </summary>
        private static void AddScriptBundles(BundleCollection bundles)
        {
            //bundling the app folder(controllers,custom directives and custom services)
            bundles.Add<ScriptBundle>("~/app", bundle => bundle.PageLocation = "AppJs");
            // A bundle of  scripts that will likely be used on every page of the app
            //bundling for all common javascript files start
            List<string> CommonScript = new List<string>();
            var bundleCommonScriptfiles = CommonUtils.Centroid.CommonScript;
            foreach (var file in bundleCommonScriptfiles)
            {
                CommonScript.Add("~/" + file.Replace("\n", "").Trim());
            }
            var CommonScriptRelativePath = CommonUtils.Centroid.CommonScriptRelativePath[0];
            bundles.Add<ScriptBundle>((string)CommonScriptRelativePath,
                                     CommonScript,
                                     bundle => bundle.PageLocation = "CommonScript");

            ////bundling for all common javascript files end

            //bundling for all common Bower Components files start
            List<string> BowerComponent = new List<string>();
            var bundlebowerComponentScriptfiles = CommonUtils.Centroid.bowerComponentScript;
            foreach (var file in bundlebowerComponentScriptfiles)
            {
                BowerComponent.Add("~/" + file.Replace("\n", "").Trim());
            }
            var bowerComponentRelativePath = CommonUtils.Centroid.BowerComponentScriptRelativePath[0];
            bundles.Add<ScriptBundle>((string)bowerComponentRelativePath,
                                     BowerComponent,
                                     bundle => bundle.PageLocation = "BowerComponentScript");


            ////bundling for all common Bower Components files end
        }

        /// <summary>
        /// Templates Bundling
        /// </summary>
        private static void AddTemplateBundles(BundleCollection bundles)
        {
            // bundles.Add<HtmlTemplateBundle>("~/Contents/tpl", bundle => bundle.PageLocation = "Templates");
        }


    }
}