<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | Kukode</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          *, *::before, *::after {
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #1e293b;
            background-color: #f8fafc;
            margin: 0;
            padding: 30px 20px;
            font-size: 14px;
            line-height: 1.5;
          }
          .container {
            max-width: 1140px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            overflow: hidden;
          }
          .header {
            padding: 28px 32px 24px;
            border-bottom: 1px solid #e2e8f0;
            background: #ffffff;
          }
          .header h1 {
            margin: 0 0 8px 0;
            font-size: 26px;
            font-weight: 700;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .header h1 .badge-xml {
            font-size: 12px;
            font-weight: 600;
            background: #e0f2fe;
            color: #0284c7;
            padding: 3px 8px;
            border-radius: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .header .lead {
            color: #475569;
            font-size: 14px;
            margin: 0 0 16px 0;
          }
          .notice-box {
            background-color: #f0fdf4;
            border-left: 4px solid #16a34a;
            padding: 12px 16px;
            border-radius: 4px;
            margin-bottom: 16px;
            font-size: 13px;
            color: #166534;
          }
          .notice-box a {
            color: #15803d;
            font-weight: 600;
            text-decoration: underline;
          }
          .stats-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
            padding-top: 4px;
          }
          .stats-bar strong {
            color: #0f172a;
          }
          .table-wrapper {
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            background-color: #f8fafc;
            color: #475569;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 12px 24px;
            border-bottom: 2px solid #e2e8f0;
          }
          td {
            padding: 14px 24px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #fafbfc;
          }
          tr:hover {
            background-color: #f1f5f9;
          }
          a {
            color: #0284c7;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
            color: #0369a1;
          }
          .url-main {
            font-weight: 500;
            color: #0f172a;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 600;
            text-align: center;
          }
          .badge-priority {
            background: #e0f2fe;
            color: #0369a1;
          }
          .badge-freq {
            background: #f1f5f9;
            color: #475569;
            text-transform: capitalize;
          }
          .alternates {
            margin-top: 6px;
            font-size: 11px;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .alt-tag {
            color: #64748b;
          }
          .alt-lang {
            display: inline-block;
            background: #e2e8f0;
            color: #334155;
            font-size: 10px;
            font-weight: 600;
            padding: 1px 4px;
            border-radius: 3px;
            margin-right: 4px;
            text-transform: uppercase;
          }
          .text-muted {
            color: #94a3b8;
          }
          .footer {
            text-align: center;
            margin-top: 24px;
            font-size: 12px;
            color: #94a3b8;
          }
          .footer a {
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <xsl:choose>
            <!-- SITEMAP INDEX VIEW -->
            <xsl:when test="sitemap:sitemapindex">
              <div class="header">
                <h1>
                  XML Sitemap Index
                  <span class="badge-xml">Index</span>
                </h1>
                <p class="lead">
                  This XML Sitemap Index file contains links to all sub-sitemaps for search engines like Google and Bing.
                </p>
                <div class="notice-box">
                  Generated by <strong>Kukode</strong> &#183; Learn more about sitemaps on <a href="https://sitemaps.org" target="_blank" rel="noopener noreferrer">sitemaps.org</a>.
                </div>
                <div class="stats-bar">
                  <span>Number of sitemaps in this index: <strong><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></strong></span>
                </div>
              </div>
              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th style="width: 70%;">Sitemap URL</th>
                      <th style="width: 30%;">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                      <tr>
                        <td>
                          <a class="url-main" href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                        </td>
                        <td>
                          <xsl:choose>
                            <xsl:when test="sitemap:lastmod">
                              <xsl:value-of select="sitemap:lastmod"/>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="text-muted">-</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:when>

            <!-- URL SET VIEW -->
            <xsl:otherwise>
              <div class="header">
                <h1>
                  XML Sitemap
                  <span class="badge-xml">RankMath / Yoast Style</span>
                </h1>
                <p class="lead">
                  This XML Sitemap contains URLs that search engines like Google, Bing, and Yahoo can crawl and index.
                </p>
                <div class="notice-box">
                  Generated by <strong>Kukode</strong> &#183; Learn more about sitemaps on <a href="https://sitemaps.org" target="_blank" rel="noopener noreferrer">sitemaps.org</a>.
                </div>
                <div class="stats-bar">
                  <span>Total URLs in this sitemap: <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong></span>
                </div>
              </div>
              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th style="width: 55%;">URL</th>
                      <th style="width: 12%;">Priority</th>
                      <th style="width: 15%;">Change Freq.</th>
                      <th style="width: 18%;">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:urlset/sitemap:url">
                      <tr>
                        <td>
                          <a class="url-main" href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                          <xsl:if test="xhtml:link">
                            <div class="alternates">
                              <xsl:for-each select="xhtml:link">
                                <div class="alt-tag">
                                  <span class="alt-lang"><xsl:value-of select="@hreflang"/></span>
                                  <a href="{@href}"><xsl:value-of select="@href"/></a>
                                </div>
                              </xsl:for-each>
                            </div>
                          </xsl:if>
                        </td>
                        <td>
                          <xsl:choose>
                            <xsl:when test="sitemap:priority">
                              <span class="badge badge-priority"><xsl:value-of select="sitemap:priority"/></span>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="text-muted">-</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                        <td>
                          <xsl:choose>
                            <xsl:when test="sitemap:changefreq">
                              <span class="badge badge-freq"><xsl:value-of select="sitemap:changefreq"/></span>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="text-muted">-</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                        <td>
                          <xsl:choose>
                            <xsl:when test="sitemap:lastmod">
                              <xsl:value-of select="sitemap:lastmod"/>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="text-muted">-</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:otherwise>
          </xsl:choose>
        </div>
        <div class="footer">
          XML Sitemap &#183; Powered by <a href="/">Kukode Digital Technology</a>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
