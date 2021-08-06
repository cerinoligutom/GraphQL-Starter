---
to: '<%= locals.restRouteHandler ? `src/modules/${h.changeCase.param(locals.module?.name)}/routes/handlers/${h.changeCase.param(locals.restRouteHandler?.name)}.handler.ts` : null %>'
---
import { RequestHandler } from 'express';
import { <%= h.changeCase.camel(locals.restRouteHandler?.useCaseName) %>UseCase } from '../../use-cases/<%= h.changeCase.param(locals.restRouteHandler?.useCaseName) %>.use-case';

interface I<%= h.changeCase.pascal(locals.restRouteHandler?.name) %>Response {

}
export const <%= h.changeCase.camel(locals.restRouteHandler?.name) %>Handler: RequestHandler<any, I<%= h.changeCase.pascal(locals.restRouteHandler?.name) %>Response, any, any> = async (req, res) => {
  // Extract the data from common sources of input
  const { } = req.params;
  const { } = req.query;
  const { } = req.body;
  
  // Extract the result from the use case
  const { } = await <%= h.changeCase.camel(locals.restRouteHandler?.useCaseName) %>UseCase(
    {

    },
    { req, res }
  )

  res.send({
    // TODO: 
    // Make sure to use a factory to transform the db model results into a response model 
    // from the use case result if there is any
  });
}
