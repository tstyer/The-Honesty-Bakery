"""
URL configuration for backend project.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),

    # API (or app) routes first
    path('api/', include('base.urls')),

    re_path(
        r'^static/(?P<path>.*)$',
        serve,
        {
            'document_root': settings.BASE_DIR
            / 'frontend'
            / 'build'
            / 'static'
        },
    ),

    re_path(
        r'^images/(?P<path>.*)$',
        serve,
        {
            'document_root': settings.BASE_DIR
            / 'frontend'
            / 'build'
            / 'images'
        },
    ),

    # React catch-all LAST (and it avoids api/static/media)
    re_path(
        r'^(?!api/|admin/|static/|media/).*$',
        TemplateView.as_view(template_name='index.html'),
    ),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT,
)

# Serve static files in development
urlpatterns += staticfiles_urlpatterns()
