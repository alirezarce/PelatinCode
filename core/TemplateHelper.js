import nunjucks from 'nunjucks';
import {log,toNumber} from './utils.js';
import translate from './translate.js';

export function alertDangerExtension() {
    this.tags = ['AlertDanger'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('endAlertDanger');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args,[body]);
    };

    this.run = function(context,key,body) {
        try{
            const msg = context?.ctx?.settings?.req?.query?.msg ?? '';
            if(msg === key)
            {
                const html = `
                    <div class="text-center alert alert-danger">${body()}</div>
                `;
                return nunjucks.runtime.markSafe(html);
            }    
        }
        catch(e){
            return e.toString();
        }
    };
}


export function alertSuccessExtension() {
	console.log('alertSuccessExtension is call')
    this.tags = ['AlertSuccess'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('endAlertSuccess');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args,[body]);
    };

    this.run = function(context,key,body) {
        try{
            const msg = context?.ctx?.settings?.req?.query?.msg ?? '';
            if(msg === key)
            {
                const html = `
                    <div class="text-center alert alert-success">${body()}</div>
                `;
                return nunjucks.runtime.markSafe(html);
            }    
        }
        catch(e){
		console.log(e)
            return e.toString();
        }
    };
}

export function menuItemExtension() {
    this.tags = ['menuItem'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('endMenuItem');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args,[body]);
    };

    this.run = function(context,key,body) {
        try{
            let currentRoute = context.ctx.settings.req.baseUrl + context.ctx.settings.req.path;
            if(!currentRoute.endsWith('/'))
                currentRoute += '/';
            if(key.indexOf('*') != -1)
            {
                const paths = currentRoute.split('/');
                paths.shift();
                // log(paths);
                if(paths.length > 0)
                {
                    currentRoute = '/'+ paths[0] + '/' + paths[1] + '/*';
                    // log('currentRoute => '  + currentRoute);
                    // log('key => ' + key);
                    if(currentRoute == key)
                    {
                        return 'active';
                    }
                }
            }
            else
            {
                if(currentRoute == key)
                {
                    return 'active';
                }    
            }
        }
        catch(e){
            return e.toString();
        }
    };
}


export function renderPaginationExtension() {
    this.tags = ['renderPagination'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('endRenderPagination');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args,[body]);
    };

    this.run = function(context,key,body) {
        try{
            let page = toNumber(context.ctx.settings.req.query?.page);
            if(page <= 0)
                page = 1;
            const nextUrl = key.url + '&page=' + (page + 1);
            const prevUrl = key.url + '&page=' + (page - 1);
            const firstPageUrl = key.url + '&page=1';
            const lastPageUrl = key.url + '&page=' + key.totalPage;
            const lastPageClass = (page === key.totalPage) ? 'disabled' : '';
            const firstPageClass = (page === 1) ? 'disabled' : '';
            const prevPageClass = (page > 1) ? '' : 'disabled';
            const nextPageClass = (page < key.totalPage ) ? '' : 'disabled';
            let html = `
                        <nav>
                            <ul class="pagination mt-3 justify-content-center">
                                <li class="page-item ${lastPageClass}">
                                    <a class="page-link" href="${lastPageUrl}">
                                        ${translate.t('pagination_last_page')}
                                    </a>
                                </li>
                                <li class="page-item ${nextPageClass}">
                                    <a class="page-link" href="${nextUrl}">
                                        ${translate.t('pagination_next_page')}
                                    </a>
                                </li>
                                <li class="page-item active pagination-input-holder">
                                    <input type="text" data-pagination-url="${key.url}" value="${page}" class="pagination-input-page">
                                    ${translate.t('pagination_from')}
                                    <b>${key.totalPage}</b>
                                </li>
                                <li class="page-item ${prevPageClass}">
                                    <a class="page-link" href="${prevUrl}">
                                        ${translate.t('pagination_prev_page')}
                                    </a>
                                </li>
                                <li class="page-item ${firstPageClass}">
                                    <a class="page-link" href="${firstPageUrl}">
                                        ${translate.t('pagination_first_page')}
                                    </a>
                                </li>

                            </ul>
                        </nav>
                    `
            return nunjucks.runtime.markSafe(html);
        }
        catch(e){
            return e.toString();
        }
    };
}

export function renderPaginationExtensionFront() {
    this.tags = ['renderPaginationFront'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('endRenderPaginationFront');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args,[body]);
    };

    this.run = function(context,key,body) {
        try{
            let page = toNumber(context.ctx.settings.req.query?.page);
            if(page <= 0)
                page = 1;
            const nextUrl = key.url + '&page=' + (page + 1);
            const prevUrl = key.url + '&page=' + (page - 1);
            const firstPageUrl = key.url + '&page=1';
            const lastPageUrl = key.url + '&page=' + key.totalPage;
            const lastPageClass = (page === key.totalPage) ? 'disabled' : '';
            const firstPageClass = (page === 1) ? 'disabled' : '';
            const prevPageClass = (page > 1) ? '' : 'disabled';
            const nextPageClass = (page < key.totalPage ) ? '' : 'disabled';
            let html = `
                        <nav>
                            <ul class="pagination mt-3 justify-content-center">
                                <li  class="  ${lastPageClass}">
                                    <a class="btn-default btn-small round" href="${lastPageUrl}">
                                        ${translate.t('pagination_last_page')}
                                    </a>
                                </li>
                                <li class="${nextPageClass}">
                                    <a class="btn-default btn-small round" href="${nextUrl}">
                                        ${translate.t('pagination_next_page')}
                                    </a>
                                </li>
                                <li class="">
                                    <input type="text" style="text-align: center;" data-pagination-url="${key.url}" value="${page}" >
                                </li>
                                <li class="page-item ${prevPageClass}">
                                    <a class="btn-default btn-small round" href="${prevUrl}">
                                        ${translate.t('pagination_prev_page')}
                                    </a>
                                </li>
                                <li class="page-item ${firstPageClass}">
                                    <a class="btn-default btn-small round" href="${firstPageUrl}">
                                        ${translate.t('pagination_first_page')}
                                    </a>
                                </li>

                            </ul>
                        </nav>
                    `
            return nunjucks.runtime.markSafe(html);
        }
        catch(e){
            return e.toString();
        }
    };
}



export function renderFieldExtension() {
    this.tags = ['renderField'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('endRenderField');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args,[body]);
    };

    this.run = function(context,key,body) {
        try{
            const req = context.ctx.settings.req;
            let iconSort = '';
            let url = key.url + `&sort_field=${key.sort_field}`;
            if(req.session?.sort_type === 'asc')
            {
                url += '&sort_type=desc';
                iconSort = '<span class="fa-solid fa-sort-alpha-asc"></span>';
            }
            else if(req.session?.sort_type === 'desc')
            {
                url += '&sort_type=asc';
                iconSort = '<span class="fa-solid fa-sort-alpha-desc"></span>';
            }
            let html = '';
            if(req.session?.sort_field === key.sort_field)
            {
                html = `
                <a href="${url}">
                    ${key.title}
                    ${iconSort}
                </a>
                `;
            }
            else
            {
                html = `
                <a href="${url}">
                    ${key.title}
                    <span class="fa-solid fa-sort"></span>
                </a>
                `;
            }
            return nunjucks.runtime.markSafe(html);
        }
        catch(e){
            return e.toString();
        }
    };
}


