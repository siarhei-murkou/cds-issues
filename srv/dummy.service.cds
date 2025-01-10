using sap.cap.issues as db from '../db';

@path: '/dummy-service'
@impl: './dist/event-handlers/dummy.cds.service'
service DummyService {

    /** Dummy CDS projections, functions etc. */

    entity Dummies          as projection on db.Dummies;
    function randomize() returns Integer not null;

    /** The CDS entity for testing CASCADE DELETE */

    entity SharedObjects    as projection on db.SharedObjects;
    entity SubObjects       as projection on db.SubObjects;
    entity TopObjects       as projection on db.TopObjects;
    entity SharedSubObjects as projection on db.SharedSubObjects;

    @singular: 'SharedTopObject'
    @plural  : 'SharedTopObjects'
    entity SharedTopObjects as projection on db.AdvancedSharedTopObjects;
}
