import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Post } from './post.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Post>;

@Injectable()
export class PostService {

    private resourceUrl =  SERVER_API_URL + 'api/posts';

    constructor(private http: HttpClient) { }

    create(post: Post): Observable<EntityResponseType> {
        const copy = this.convert(post);
        return this.http.post<Post>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(post: Post): Observable<EntityResponseType> {
        const copy = this.convert(post);
        return this.http.put<Post>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Post>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Post[]>> {
        const options = createRequestOption(req);
        return this.http.get<Post[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Post[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Post = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Post[]>): HttpResponse<Post[]> {
        const jsonResponse: Post[] = res.body;
        const body: Post[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Post.
     */
    private convertItemFromServer(post: Post): Post {
        const copy: Post = Object.assign({}, post);
        return copy;
    }

    /**
     * Convert a Post to a JSON which can be sent to the server.
     */
    private convert(post: Post): Post {
        const copy: Post = Object.assign({}, post);
        return copy;
    }
}
